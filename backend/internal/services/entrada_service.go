package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

var (
	ErrEventoNoDisponible = errors.New("el evento no existe o no está activo")
	ErrSinCupo            = errors.New("no hay cupo disponible para este evento")
)

type EntradaService struct {
	entradaDAO *dao.EntradaDAO
	eventoDAO  *dao.EventoDAO
	db         *gorm.DB
}

func NuevoEntradaService(entradaDAO *dao.EntradaDAO, eventoDAO *dao.EventoDAO, db *gorm.DB) *EntradaService {
	return &EntradaService{
		entradaDAO: entradaDAO,
		eventoDAO:  eventoDAO,
		db:         db,
	}
}

// Comprar procesa la compra de una entrada dentro de una transacción.
func (s *EntradaService) Comprar(usuarioID, eventoID uint) (*domain.Entrada, error) {
	// Verificar que el evento existe y está activo ANTES de abrir la transacción
	evento, err := s.eventoDAO.BuscarPorID(eventoID)
	if err != nil {
		return nil, err
	}
	if evento == nil || evento.Estado != "activo" {
		return nil, ErrEventoNoDisponible
	}

	var entrada *domain.Entrada

	// Transacción: descontar cupo y crear entrada de forma atómica
	err = s.db.Transaction(func(tx *gorm.DB) error {
		// Descontar cupo (falla si cupo_disponible = 0)
		if err := s.entradaDAO.DescontarCupo(tx, eventoID); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrSinCupo
			}
			return err
		}

		// Crear la entrada
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

// ListarPorUsuario retorna todas las entradas del usuario.
func (s *EntradaService) ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error) {
	return s.entradaDAO.ListarPorUsuario(usuarioID)
}
