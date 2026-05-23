package router

import (
	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/controllers"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/dao"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
	"gorm.io/gorm"
)

// Configurar arma todas las rutas de la aplicación y retorna el engine de Gin.
func Configurar(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Inicialización de capas para auth
	usuarioDAO := dao.NuevoUsuarioDAO(db)
	authService := services.NuevoAuthService(usuarioDAO)
	authController := controllers.NuevoAuthController(authService)

	// Rutas agrupadas bajo /api/v1
	api := r.Group("/api/v1")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Registrar)
			auth.POST("/login", authController.Login)
		}
	}

	return r
}
