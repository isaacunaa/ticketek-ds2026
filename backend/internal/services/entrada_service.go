package services

import (
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

var (
	ErrEventoNoDisponible   = errors.New("el evento no existe o no está activo")
	ErrSinCupo              = errors.New("no hay cupo disponible para este evento")
	ErrEntradaNoEncontrada  = errors.New("la entrada no existe")
	ErrNoEsDueno            = errors.New("no tenés permiso para modificar esta entrada")
	ErrEntradaNoActiva      = errors.New("la entrada no está activa")
	ErrDestinatarioNoExiste = errors.New("el destinatario no existe en el sistema")
)

type ITransactor interface {
	Transaction(fc func(tx *gorm.DB) error, opts ...*sql.TxOptions) error
}

type IEntradaService interface {
	Comprar(usuarioID, eventoID uint) (*domain.Entrada, error)
	ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error)
	Cancelar(usuarioID, entradaID uint) error
	Traspasar(usuarioID, entradaID uint, emailDestinatario string) (*domain.Entrada, error)
}

type EntradaService struct {
	entradaDAO dao.IEntradaDAO
	eventoDAO  dao.IEventoDAO
	usuarioDAO dao.IUsuarioDAO
	db         ITransactor
}

func NuevoEntradaService(entradaDAO dao.IEntradaDAO, eventoDAO dao.IEventoDAO, usuarioDAO dao.IUsuarioDAO, db ITransactor) *EntradaService {
	return &EntradaService{
		entradaDAO: entradaDAO,
		eventoDAO:  eventoDAO,
		usuarioDAO: usuarioDAO,
		db:         db,
	}
}

func (s *EntradaService) Comprar(usuarioID, eventoID uint) (*domain.Entrada, error) {
	evento, err := s.eventoDAO.BuscarPorID(eventoID)
	if err != nil {
		return nil, err
	}
	if evento == nil || evento.Estado != "activo" {
		return nil, ErrEventoNoDisponible
	}

	var entrada *domain.Entrada

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.entradaDAO.DescontarCupo(tx, eventoID); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrSinCupo
			}
			return err
		}

		entrada = &domain.Entrada{
			EventoID:     eventoID,
			UsuarioID:    usuarioID,
			Codigo:       uuid.New().String(),
			Estado:       "activa",
			PrecioPagado: evento.Precio,
			FechaCompra:  time.Now(),
		}

		return s.entradaDAO.Crear(tx, entrada)
	})

	if err != nil {
		return nil, err
	}

	return entrada, nil
}

func (s *EntradaService) ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error) {
	return s.entradaDAO.ListarPorUsuario(usuarioID)
}

func (s *EntradaService) Cancelar(usuarioID, entradaID uint) error {
	entrada, err := s.entradaDAO.BuscarPorID(entradaID)
	if err != nil {
		return err
	}
	if entrada == nil {
		return ErrEntradaNoEncontrada
	}
	if entrada.UsuarioID != usuarioID {
		return ErrNoEsDueno
	}
	if entrada.Estado != "activa" {
		return ErrEntradaNoActiva
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.entradaDAO.CambiarEstado(tx, entradaID, "cancelada"); err != nil {
			return err
		}
		return s.entradaDAO.DevolverCupo(tx, entrada.EventoID)
	})
}

func (s *EntradaService) Traspasar(usuarioID, entradaID uint, emailDestinatario string) (*domain.Entrada, error) {
	entrada, err := s.entradaDAO.BuscarPorID(entradaID)
	if err != nil {
		return nil, err
	}
	if entrada == nil {
		return nil, ErrEntradaNoEncontrada
	}
	if entrada.UsuarioID != usuarioID {
		return nil, ErrNoEsDueno
	}
	if entrada.Estado != "activa" {
		return nil, ErrEntradaNoActiva
	}

	destinatario, err := s.usuarioDAO.BuscarPorEmail(emailDestinatario)
	if err != nil {
		return nil, err
	}
	if destinatario == nil {
		return nil, ErrDestinatarioNoExiste
	}

	err = s.db.Transaction(func(tx *gorm.DB) error {
		return s.entradaDAO.CambiarDueno(tx, entradaID, destinatario.ID)
	})
	if err != nil {
		return nil, err
	}

	return s.entradaDAO.BuscarPorID(entradaID)
}
