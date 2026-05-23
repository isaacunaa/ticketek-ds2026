package utils

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims es la información que va dentro del token JWT.
type Claims struct {
	UsuarioID uint   `json:"usuario_id"`
	Email     string `json:"email"`
	Rol       string `json:"rol"`
	jwt.RegisteredClaims
}

// GenerarToken crea un JWT firmado para un usuario.
func GenerarToken(usuarioID uint, email, rol string) (string, error) {
	horas, err := strconv.Atoi(os.Getenv("JWT_EXPIRATION_HOURS"))
	if err != nil || horas <= 0 {
		horas = 24
	}

	claims := Claims{
		UsuarioID: usuarioID,
		Email:     email,
		Rol:       rol,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(horas) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// ValidarToken parsea y valida un JWT, retornando los claims si es válido.
func ValidarToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inválido")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}
