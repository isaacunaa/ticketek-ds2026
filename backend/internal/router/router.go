package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/controllers"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/middleware"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
	"gorm.io/gorm"
)

func Configurar(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth
	usuarioDAO := dao.NuevoUsuarioDAO(db)
	authService := services.NuevoAuthService(usuarioDAO)
	authController := controllers.NuevoAuthController(authService)

	// Eventos
	eventoDAO := dao.NuevoEventoDAO(db)
	eventoService := services.NuevoEventoService(eventoDAO)
	eventoController := controllers.NuevoEventoController(eventoService)

	// Entradas
	entradaDAO := dao.NuevoEntradaDAO(db)
	entradaService := services.NuevoEntradaService(entradaDAO, eventoDAO, usuarioDAO, db)
	entradaController := controllers.NuevoEntradaController(entradaService)

	// Favoritos
	favoritoDAO := dao.NuevoFavoritoDAO(db)
	favoritoService := services.NuevoFavoritoService(favoritoDAO, eventoDAO)
	favoritoController := controllers.NuevoFavoritoController(favoritoService)
	
	api := r.Group("/api/v1")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Registrar)
			auth.POST("/login", authController.Login)
		}

		eventos := api.Group("/eventos")
		{
			eventos.GET("", eventoController.Listar)
			eventos.GET("/:id", eventoController.ObtenerPorID)
		}

		// Rutas protegidas — requieren JWT valido
		protegido := api.Group("")
		protegido.Use(middleware.AutenticacionJWT())
		{
			protegido.POST("/entradas", entradaController.Comprar)
			protegido.GET("/entradas/me", entradaController.MisEntradas)
			protegido.DELETE("/entradas/:id", entradaController.Cancelar)
			protegido.POST("/entradas/:id/transfer", entradaController.Traspasar)

			protegido.POST("/favoritos/:eventoId", favoritoController.Agregar)
			protegido.DELETE("/favoritos/:eventoId", favoritoController.Quitar)
			protegido.GET("/favoritos", favoritoController.Listar)
		}
	}

	return r
}
