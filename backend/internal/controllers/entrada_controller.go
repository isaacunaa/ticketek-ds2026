package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
)

type EntradaController struct {
	entradaService *services.EntradaService
}

func NuevoEntradaController(entradaService *services.EntradaService) *EntradaController {
	return &EntradaController{entradaService: entradaService}
}

type ComprarRequest struct {
	EventoID uint `json:"evento_id" binding:"required"`
}

// Comprar maneja POST /api/v1/entradas
func (c *EntradaController) Comprar(ctx *gin.Context) {
	var req ComprarRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Leer usuario_id del contexto (lo puso el middleware JWT)
	usuarioID := ctx.GetUint("usuario_id")

	entrada, err := c.entradaService.Comprar(usuarioID, req.EventoID)
	if err != nil {
		if errors.Is(err, services.ErrEventoNoDisponible) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, services.ErrSinCupo) {
			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error al procesar la compra"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"entrada": entrada})
}

// MisEntradas maneja GET /api/v1/entradas/me
func (c *EntradaController) MisEntradas(ctx *gin.Context) {
	usuarioID := ctx.GetUint("usuario_id")

	entradas, err := c.entradaService.ListarPorUsuario(usuarioID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error al obtener entradas"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"entradas": entradas})
}
