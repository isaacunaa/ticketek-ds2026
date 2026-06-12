import { Link } from 'react-router-dom'

export default function Privacidad() {
  return (
    <div className="legal-page">
      <div className="legal-inner">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <h1 className="legal-title">Política de privacidad</h1>
        <p className="legal-updated">Última actualización: junio 2026</p>

        <section className="legal-section">
          <h2>1. Información que recopilamos</h2>
          <p>Recopilamos la información que nos proporcionás al registrarte: nombre, apellido y dirección de correo electrónico. También registramos el historial de compras y favoritos asociado a tu cuenta.</p>
        </section>

        <section className="legal-section">
          <h2>2. Uso de la información</h2>
          <p>Utilizamos tus datos para procesar compras, gestionar tu cuenta y mejorar la experiencia en la plataforma. No vendemos ni compartimos tu información personal con terceros sin tu consentimiento.</p>
        </section>

        <section className="legal-section">
          <h2>3. Seguridad</h2>
          <p>Tu contraseña se almacena de forma encriptada mediante algoritmos de hashing seguro. Nunca guardamos contraseñas en texto plano. Las transacciones se protegen mediante tokens JWT con expiración temporal.</p>
        </section>

        <section className="legal-section">
          <h2>4. Cookies</h2>
          <p>Utilizamos almacenamiento local del navegador (localStorage) para mantener tu sesión activa. No utilizamos cookies de seguimiento de terceros.</p>
        </section>

        <section className="legal-section">
          <h2>5. Tus derechos</h2>
          <p>Tenés derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, podés contactarnos a través de los canales oficiales de Vórtice.</p>
        </section>

        <section className="legal-section">
          <h2>6. Contacto</h2>
          <p>Para consultas sobre privacidad, escribinos a <strong>privacidad@vortice.com</strong>.</p>
        </section>
      </div>
    </div>
  )
}
