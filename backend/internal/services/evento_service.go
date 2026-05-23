package services

import (
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
)

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
