package services

import (
	"errors"

	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
)

var ErrEventoNoEncontrado = errors.New("evento no encontrado")

type IEventoService interface {
	ListarEventos(categoria, search string) ([]domain.Evento, error)
	ObtenerEventoPorID(id uint) (*domain.Evento, error)
}

type EventoService struct {
	eventoDAO dao.IEventoDAO
}

func NuevoEventoService(eventoDAO dao.IEventoDAO) *EventoService {
	return &EventoService{eventoDAO: eventoDAO}
}

func (s *EventoService) ListarEventos(categoria, search string) ([]domain.Evento, error) {
	return s.eventoDAO.ListarActivos(categoria, search)
}

func (s *EventoService) ObtenerEventoPorID(id uint) (*domain.Evento, error) {
	evento, err := s.eventoDAO.BuscarPorID(id)
	if err != nil {
		return nil, err
	}
	if evento == nil {
		return nil, ErrEventoNoEncontrado
	}
	return evento, nil
}
