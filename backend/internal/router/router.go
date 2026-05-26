package router

import (
	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/controllers"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/middleware"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
	"gorm.io/gorm"
)

func Configurar(db *gorm.DB) *gin.Engine {
	r := gin.Default()

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
			// Acá van los endpoints autenticados
			// Se completan en los proximos pasos
		}
	}

	return r
}
