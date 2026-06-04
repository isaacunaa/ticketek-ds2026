package seed

import (
	"log"
	"time"

	"github.com/isaacunaa/ticketek-ds2026/backend/internal/domain"
	"github.com/isaacunaa/ticketek-ds2026/backend/internal/utils"
	"gorm.io/gorm"
)

func Ejecutar(db *gorm.DB) {
	seedUsuarios(db)
	seedEventos(db)
}

func seedUsuarios(db *gorm.DB) {
	var count int64
	db.Model(&domain.Usuario{}).Count(&count)
	if count > 0 {
		return
	}

	usuarios := []struct {
		email    string
		password string
		nombre   string
		apellido string
		rol      string
	}{
		{"admin@vortice.com", "admin123", "Admin", "Vórtice", "admin"},
		{"juan@mail.com", "123456", "Juan", "Pérez", "cliente"},
		{"maria@mail.com", "123456", "María", "González", "cliente"},
	}

	for _, u := range usuarios {
		hash, err := utils.HashearPassword(u.password)
		if err != nil {
			log.Printf("Error hasheando password de %s: %v", u.email, err)
			continue
		}
		usuario := domain.Usuario{
			Email:        u.email,
			PasswordHash: hash,
			Nombre:       u.nombre,
			Apellido:     u.apellido,
			Rol:          u.rol,
		}
		if err := db.Create(&usuario).Error; err != nil {
			log.Printf("Error creando usuario %s: %v", u.email, err)
		}
	}
	log.Println("Seed: usuarios creados")
}

func seedEventos(db *gorm.DB) {
	var count int64
	db.Model(&domain.Evento{}).Count(&count)
	if count > 0 {
		return
	}

	eventos := []domain.Evento{
		{
			Titulo:          "Lollapalooza Argentina 2026",
			Descripcion:     "El festival de música más grande de Latinoamérica vuelve a Buenos Aires.",
			FechaHora:       time.Date(2026, 3, 20, 14, 0, 0, 0, time.UTC),
			DuracionMinutos: 480,
			Ubicacion:       "Hipódromo de San Isidro, Buenos Aires",
			Categoria:       "musica",
			CupoTotal:       50000,
			CupoDisponible:  50000,
			Precio:          25000,
			ImagenURL:       "https://placehold.co/600x400?text=Lollapalooza",
			Estado:          "activo",
		},
		{
			Titulo:          "River vs Boca - Superclásico",
			Descripcion:     "El partido más esperado del año en el Monumental.",
			FechaHora:       time.Date(2026, 4, 5, 20, 0, 0, 0, time.UTC),
			DuracionMinutos: 120,
			Ubicacion:       "Estadio Monumental, Buenos Aires",
			Categoria:       "deporte",
			CupoTotal:       8000,
			CupoDisponible:  8000,
			Precio:          15000,
			ImagenURL:       "https://placehold.co/600x400?text=Superclasico",
			Estado:          "activo",
		},
		{
			Titulo:          "Stand Up: Noche de Comedia",
			Descripcion:     "Los mejores comediantes del país en una noche inolvidable.",
			FechaHora:       time.Date(2026, 5, 15, 21, 0, 0, 0, time.UTC),
			DuracionMinutos: 90,
			Ubicacion:       "Teatro Gran Rex, Buenos Aires",
			Categoria:       "teatro",
			CupoTotal:       1200,
			CupoDisponible:  1200,
			Precio:          8000,
			ImagenURL:       "https://placehold.co/600x400?text=Stand+Up",
			Estado:          "activo",
		},
		{
			Titulo:          "Cirque du Soleil - Alegría",
			Descripcion:     "El espectáculo de circo contemporáneo más famoso del mundo.",
			FechaHora:       time.Date(2026, 6, 10, 20, 30, 0, 0, time.UTC),
			DuracionMinutos: 120,
			Ubicacion:       "Parque de la Ciudad, Buenos Aires",
			Categoria:       "espectaculo",
			CupoTotal:       3000,
			CupoDisponible:  3000,
			Precio:          18000,
			ImagenURL:       "https://placehold.co/600x400?text=Cirque+du+Soleil",
			Estado:          "activo",
		},
	}

	for _, e := range eventos {
		if err := db.Create(&e).Error; err != nil {
			log.Printf("Error creando evento '%s': %v", e.Titulo, err)
		}
	}
	log.Println("Seed: eventos creados")
}
