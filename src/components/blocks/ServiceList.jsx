import { ServiceIcon } from './icons'

export default function ServiceList({ content }) {
  const { title, subtitle, items = [] } = content || {}
  return (
    <section className="block-section">
      <div className="wrap">
        {(title || subtitle) && (
          <div className="section-head">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {items.map((service, i) => (
          <div className="service-row" key={i}>
            <ServiceIcon icon={service.icon} color={['var(--blue)', 'var(--orange)', 'var(--green)'][i % 3]} />
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
