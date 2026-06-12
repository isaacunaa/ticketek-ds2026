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
			Descripcion:     "El festival de música más grande de Latinoamérica vuelve a Buenos Aires con los mejores artistas del mundo.",
			FechaHora:       time.Date(2026, 3, 20, 14, 0, 0, 0, time.UTC),
			DuracionMinutos: 480,
			Ubicacion:       "Hipódromo de San Isidro, Buenos Aires",
			Categoria:       "Música",
			CupoTotal:       50000,
			CupoDisponible:  50000,
			Precio:          25000,
			ImagenURL:       "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop&auto=format",
			Estado:          "activo",
		},
		{
			Titulo:          "River vs Boca - Superclásico",
			Descripcion:     "El partido más esperado del año. River Plate recibe a Boca Juniors en el estadio más grande del país.",
			FechaHora:       time.Date(2026, 4, 5, 20, 0, 0, 0, time.UTC),
			DuracionMinutos: 120,
			Ubicacion:       "Estadio Monumental, Buenos Aires",
			Categoria:       "Deportes",
			CupoTotal:       8000,
			CupoDisponible:  8000,
			Precio:          15000,
			ImagenURL:       "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop&auto=format",
			Estado:          "activo",
		},
		{
			Titulo:          "Stand Up: Noche de Comedia",
			Descripcion:     "Los mejores comediantes del país en una noche inolvidable de risas y humor en el corazón de Buenos Aires.",
			FechaHora:       time.Date(2026, 5, 15, 21, 0, 0, 0, time.UTC),
			DuracionMinutos: 90,
			Ubicacion:       "Teatro Gran Rex, Buenos Aires",
			Categoria:       "Humor",
			CupoTotal:       1200,
			CupoDisponible:  1200,
			Precio:          8000,
			ImagenURL:       "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=400&fit=crop&auto=format",
			Estado:          "activo",
		},
		{
			Titulo:          "Cirque du Soleil - Alegría",
			Descripcion:     "El espectáculo de circo contemporáneo más famoso del mundo llega con su producción más deslumbrante.",
			FechaHora:       time.Date(2026, 6, 10, 20, 30, 0, 0, time.UTC),
			DuracionMinutos: 120,
			Ubicacion:       "Parque de la Ciudad, Buenos Aires",
			Categoria:       "Arte",
			CupoTotal:       3000,
			CupoDisponible:  3000,
			Precio:          18000,
			ImagenURL:       "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop&auto=format",
			Estado:          "activo",
		},
		{
			Titulo:          "Romeo y Julieta — Teatro San Martín",
			Descripcion:     "La obra más romántica de Shakespeare interpretada por el elenco estable del Teatro San Martín.",
			FechaHora:       time.Date(2026, 7, 3, 20, 0, 0, 0, time.UTC),
			DuracionMinutos: 150,
			Ubicacion:       "Teatro San Martín, Buenos Aires",
			Categoria:       "Teatro",
			CupoTotal:       800,
			CupoDisponible:  800,
			Precio:          6000,
			ImagenURL:       "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop&auto=format",
			Estado:          "activo",
		},
		{
			Titulo:          "Buenos Aires Tech Summit 2026",
			Descripcion:     "El encuentro de tecnología más importante de Argentina. Charlas, workshops y networking con referentes del sector.",
			FechaHora:       time.Date(2026, 8, 22, 9, 0, 0, 0, time.UTC),
			DuracionMinutos: 480,
			Ubicacion:       "Centro Costa Salguero, Buenos Aires",
			Categoria:       "Tecnología",
			CupoTotal:       2000,
			CupoDisponible:  2000,
			Precio:          12000,
			ImagenURL:       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format",
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
