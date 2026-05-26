package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/utils"
)

// AutenticacionJWT verifica que la request traiga un JWT valido en el header
// Authorization. Si lo es, guarda los datos del usuario en el contexto.
// Si no, corta con 401.
func AutenticacionJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Leer el header Authorization
		header := c.GetHeader("Authorization")
		if header == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "falta el header Authorization",
			})
			return
		}

		// 2. Verificar formato "Bearer <token>"
		partes := strings.Split(header, " ")
		if len(partes) != 2 || partes[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "formato de Authorization invalido, se espera 'Bearer <token>'",
			})
			return
		}

		// 3. Validar el token con nuestro utilitario
		claims, err := utils.ValidarToken(partes[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "token invalido o expirado",
			})
			return
		}

		// 4. Guardar datos del usuario en el contexto de Gin
		c.Set("usuario_id", claims.UsuarioID)
		c.Set("email", claims.Email)
		c.Set("rol", claims.Rol)

		// 5. Continuar a la siguiente funcion (el controller)
		c.Next()
	}
}
