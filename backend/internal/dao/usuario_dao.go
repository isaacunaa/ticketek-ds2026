package dao

import (
	"errors"

	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

type IUsuarioDAO interface {
	BuscarPorEmail(email string) (*domain.Usuario, error)
	Crear(usuario *domain.Usuario) error
	BuscarPorID(id uint) (*domain.Usuario, error)
}

type UsuarioDAO struct {
	db *gorm.DB
}

func NuevoUsuarioDAO(db *gorm.DB) *UsuarioDAO {
	return &UsuarioDAO{db: db}
}

// Crear inserta un nuevo usuario en la base.
func (d *UsuarioDAO) Crear(usuario *domain.Usuario) error {
	return d.db.Create(usuario).Error
}

// BuscarPorEmail retorna el usuario con ese email, o nil si no existe.
func (d *UsuarioDAO) BuscarPorEmail(email string) (*domain.Usuario, error) {
	var usuario domain.Usuario
	err := d.db.Where("email = ?", email).First(&usuario).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &usuario, nil
}

// BuscarPorID retorna el usuario con ese ID, o nil si no existe.
func (d *UsuarioDAO) BuscarPorID(id uint) (*domain.Usuario, error) {
	var usuario domain.Usuario
	err := d.db.First(&usuario, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &usuario, nil
}
