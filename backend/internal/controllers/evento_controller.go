package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/services"
)

type EventoController struct {
	eventoService *services.EventoService
}

func NuevoEventoController(eventoService *services.EventoService) *EventoController {
	return &EventoController{eventoService: eventoService}
}

// Listar maneja GET /api/v1/eventos.
// Query params opcionales: ?categoria=string, ?search=string
func (c *EventoController) Listar(ctx *gin.Context) {
	categoria := ctx.Query("categoria")
	search := ctx.Query("search")

	eventos, err := c.eventoService.ListarEventos(categoria, search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error al obtener eventos"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"eventos": eventos})
}
