import { Link } from 'react-router-dom'

export default function Terminos() {
  return (
    <div className="legal-page">
      <div className="legal-inner">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <h1 className="legal-title">Términos y condiciones</h1>
        <p className="legal-updated">Última actualización: junio 2026</p>

        <section className="legal-section">
          <h2>1. Aceptación de los términos</h2>
          <p>Al acceder y utilizar la plataforma Vórtice, aceptás cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestros servicios.</p>
        </section>

        <section className="legal-section">
          <h2>2. Descripción del servicio</h2>
          <p>Vórtice es una plataforma de venta y gestión de entradas para eventos culturales, deportivos y de entretenimiento en Argentina. Actuamos como intermediario entre los organizadores de eventos y los compradores de entradas.</p>
        </section>

        <section className="legal-section">
          <h2>3. Registro de cuenta</h2>
          <p>Para adquirir entradas debés registrar una cuenta con información verídica y actualizada. Sos responsable de mantener la confidencialidad de tus credenciales de acceso.</p>
        </section>

        <section className="legal-section">
          <h2>4. Compra de entradas</h2>
          <p>Todas las compras son definitivas una vez confirmadas. Las entradas están sujetas a disponibilidad. Vórtice se reserva el derecho de cancelar transacciones que incumplan estas condiciones.</p>
        </section>

        <section className="legal-section">
          <h2>5. Precios y pagos</h2>
          <p>Los precios se expresan en pesos argentinos (ARS) e incluyen los cargos por servicio. Los precios pueden variar según la demanda y disponibilidad.</p>
        </section>

        <section className="legal-section">
          <h2>6. Traspaso de entradas</h2>
          <p>Las entradas pueden traspasarse a otro usuario registrado en la plataforma. Una vez realizado el traspaso, la titularidad cambia de forma definitiva e irreversible.</p>
        </section>

        <section className="legal-section">
          <h2>7. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigencia al publicarse en la plataforma.</p>
        </section>
      </div>
    </div>
  )
}
