package services

import (
	"errors"

	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
)

var ErrEventoNoEncontrado = errors.New("evento no encontrado")

type EventoService struct {
	eventoDAO *dao.EventoDAO
}

func NuevoEventoService(eventoDAO *dao.EventoDAO) *EventoService {
	return &EventoService{eventoDAO: eventoDAO}
}

// ListarEventos retorna los eventos activos, con filtros opcionales.
func (s *EventoService) ListarEventos(categoria, search string) ([]domain.Evento, error) {
	return s.eventoDAO.ListarActivos(categoria, search)
}

// ObtenerEventoPorID retorna un evento por su ID, sin importar su estado.
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
