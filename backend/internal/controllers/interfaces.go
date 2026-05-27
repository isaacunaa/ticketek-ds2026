package controllers

import "github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"

// IAuthService define los métodos de AuthService usados por el AuthController.
type IAuthService interface {
	Registrar(email, password, nombre, apellido string) (*domain.Usuario, string, error)
	Login(email, password string) (*domain.Usuario, string, error)
}

// IEventoService define los métodos de EventoService usados por el EventoController.
type IEventoService interface {
	ListarEventos(categoria, search string) ([]domain.Evento, error)
	ObtenerEventoPorID(id uint) (*domain.Evento, error)
}

// IEntradaService define los métodos de EntradaService usados por el EntradaController.
type IEntradaService interface {
	Comprar(usuarioID, eventoID uint) (*domain.Entrada, error)
	ListarPorUsuario(usuarioID uint) ([]domain.Entrada, error)
	Cancelar(usuarioID, entradaID uint) error
	Traspasar(usuarioID, entradaID uint, emailDestinatario string) (*domain.Entrada, error)
}
