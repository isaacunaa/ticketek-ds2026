package dao

import (
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

type EventoDAO struct {
	db *gorm.DB
}

func NuevoEventoDAO(db *gorm.DB) *EventoDAO {
	return &EventoDAO{db: db}
}

// ListarActivos retorna todos los eventos con estado 'activo'.
// Acepta filtros opcionales: categoria exacta y búsqueda por título (LIKE).
func (d *EventoDAO) ListarActivos(categoria, search string) ([]domain.Evento, error) {
	var eventos []domain.Evento

	query := d.db.Where("estado = ?", "activo")

	if categoria != "" {
		query = query.Where("categoria = ?", categoria)
	}

	if search != "" {
		query = query.Where("titulo LIKE ?", "%"+search+"%")
	}

	if err := query.Find(&eventos).Error; err != nil {
		return nil, err
	}

	return eventos, nil
}
