package domain

import "time"

type Usuario struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null;size:255" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Nombre       string    `gorm:"not null;size:100" json:"nombre"`
	Apellido     string    `gorm:"not null;size:100" json:"apellido"`
	Rol          string    `gorm:"not null;size:20;default:'cliente'" json:"rol"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
