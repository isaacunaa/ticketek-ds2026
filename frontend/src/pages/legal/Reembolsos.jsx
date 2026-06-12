import { Link } from 'react-router-dom'

export default function Reembolsos() {
  return (
    <div className="legal-page">
      <div className="legal-inner">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <h1 className="legal-title">Política de reembolso</h1>
        <p className="legal-updated">Última actualización: junio 2026</p>

        <section className="legal-section">
          <h2>1. Cancelación por parte del usuario</h2>
          <p>Podés cancelar una entrada desde la sección "Mis Entradas" de tu cuenta. La cancelación libera el cupo del evento, pero <strong>no implica un reembolso monetario automático</strong>. El reembolso queda sujeto a la política del organizador del evento.</p>
        </section>

        <section className="legal-section">
          <h2>2. Cancelación de evento</h2>
          <p>Si un evento es cancelado por el organizador, todos los compradores de entradas serán notificados. En estos casos, el reembolso del valor total de la entrada está garantizado.</p>
        </section>

        <section className="legal-section">
          <h2>3. Traspaso como alternativa</h2>
          <p>Antes de cancelar una entrada, considerá utilizar la función de <strong>Traspaso</strong>, que te permite transferir tu entrada a otro usuario registrado en la plataforma sin perder el valor de la misma.</p>
        </section>

        <section className="legal-section">
          <h2>4. Plazos</h2>
          <p>Para solicitar un reembolso, la cancelación debe realizarse con un mínimo de 48 horas antes del inicio del evento. No se procesarán reembolsos por cancelaciones realizadas con menos de 48 horas de anticipación.</p>
        </section>

        <section className="legal-section">
          <h2>5. Cargos por servicio</h2>
          <p>Los cargos por servicio cobrados por Vórtice no son reembolsables, salvo en casos de cancelación total del evento por parte del organizador.</p>
        </section>

        <section className="legal-section">
          <h2>6. Contacto</h2>
          <p>Para consultas sobre reembolsos, escribinos a <strong>soporte@vortice.com</strong>.</p>
        </section>
      </div>
    </div>
  )
}
