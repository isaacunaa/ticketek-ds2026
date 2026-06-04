package dtos

type ComprarRequest struct {
	EventoID uint `json:"evento_id" binding:"required"`
}

type TraspasoRequest struct {
	Email string `json:"email" binding:"required,email"`
}
