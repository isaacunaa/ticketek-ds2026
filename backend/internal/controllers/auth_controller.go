package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
)

type AuthController struct {
	authService *services.AuthService
}

func NuevoAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// RegistrarRequest es el body esperado en POST /auth/register.
type RegistrarRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Nombre   string `json:"nombre" binding:"required"`
	Apellido string `json:"apellido" binding:"required"`
}

// LoginRequest es el body esperado en POST /auth/login.
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Registrar maneja POST /auth/register.
func (c *AuthController) Registrar(ctx *gin.Context) {
	var req RegistrarRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usuario, token, err := c.authService.Registrar(req.Email, req.Password, req.Nombre, req.Apellido)
	if err != nil {
		if errors.Is(err, services.ErrEmailYaRegistrado) {
			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error al registrar usuario"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"usuario": usuario,
		"token":   token,
	})
}

// Login maneja POST /auth/login.
func (c *AuthController) Login(ctx *gin.Context) {
	var req LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usuario, token, err := c.authService.Login(req.Email, req.Password)
	if err != nil {
		if errors.Is(err, services.ErrCredencialesInvalidas) {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error al iniciar sesión"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"usuario": usuario,
		"token":   token,
	})
}
