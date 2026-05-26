package dao

import (
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

type EntradaDAO struct {
	db *gorm.DB
}

func NuevoEntradaDAO(db *gorm.DB) *EntradaDAO {
	return &EntradaDAO{db: db}
}

// Crear inserta una nueva entrada dentro de una transacción.
func (d *EntradaDAO) Crear(tx *gorm.DB, entrada *domain.Entrada) error {
	return tx.Create(entrada).Error
}

// DescontarCupo resta 1 al cupo_disponible del evento dentro de una transacción.
// Solo descuenta si cupo_disponible > 0 (previene negativos).
func (d *EntradaDAO) DescontarCupo(tx *gorm.DB, eventoID uint) error {
	resultado := tx.Model(&domain.Evento{}).
		Where("id = ? AND cupo_disponible > 0", eventoID).
		UpdateColumn("cupo_disponible", gorm.Expr("cupo_disponible - 1"))
	if resultado.Error != nil {
		return resultado.Error
	}
	if resultado.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// ListarPorUsuario retorna todas las entradas de un usuario con el evento incluido.
func (d *EntradaDAO) ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error) {
	var entradas []domain.Entrada
	err := d.db.Preload("Evento").
		Where("usuario_id = ?", usuarioID).
		Find(&entradas).Error
	return entradas, err
}
