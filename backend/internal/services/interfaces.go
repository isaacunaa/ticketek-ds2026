package services

import (
	"database/sql"

	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"gorm.io/gorm"
)

// IUsuarioDAO define los métodos de acceso a Usuario usados por los services.
type IUsuarioDAO interface {
	BuscarPorEmail(email string) (*domain.Usuario, error)
	Crear(usuario *domain.Usuario) error
	BuscarPorID(id uint) (*domain.Usuario, error)
}

// IEventoDAO define los métodos de acceso a Evento usados por los services.
type IEventoDAO interface {
	ListarActivos(categoria, search string) ([]domain.Evento, error)
	BuscarPorID(id uint) (*domain.Evento, error)
}

// IEntradaDAO define los métodos de acceso a Entrada usados por los services.
type IEntradaDAO interface {
	Crear(tx *gorm.DB, entrada *domain.Entrada) error
	DescontarCupo(tx *gorm.DB, eventoID uint) error
	ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error)
	BuscarPorID(id uint) (*domain.Entrada, error)
	CambiarEstado(tx *gorm.DB, entradaID uint, nuevoEstado string) error
	DevolverCupo(tx *gorm.DB, eventoID uint) error
	CambiarDueno(tx *gorm.DB, entradaID uint, nuevoUsuarioID uint) error
}

// ITransactor abstrae la ejecución de transacciones de BD.
// *gorm.DB satisface esta interfaz, por lo que el router no requiere cambios.
type ITransactor interface {
	Transaction(fc func(tx *gorm.DB) error, opts ...*sql.TxOptions) error
}
