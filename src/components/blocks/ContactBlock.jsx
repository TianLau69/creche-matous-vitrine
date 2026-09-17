export default function ContactBlock({ content }) {
  const { title, subtitle, hours_text, email, phone, locations = [] } = content || {}
  return (
    <section className="block-section block-contact">
      <div className="wrap">
        {(title || subtitle) && (
          <div className="section-head">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className="contact-grid">
          <div className="contact-card">
            <h3 style={{ color: 'var(--blue)' }}>Horaires</h3>
            {hours_text && <p>{hours_text}</p>}
            <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {email && <a className="btn" href={`mailto:${email}`}>Nous écrire</a>}
              {phone && <a className="btn ghost" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
            </div>
          </div>
          <div className="contact-locations">
            {locations.map((loc, i) => (
              <div className="contact-card" key={i}>
                <h3 style={{ color: loc.color || 'var(--blue)' }}>{loc.name}</h3>
                {loc.note && <p>{loc.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
