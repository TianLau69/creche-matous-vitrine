import { Link } from 'react-router-dom'

export default function DoorsGrid({ content }) {
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
        <div className="doors">
          {items.map((door, i) => {
            const internal = door.link?.startsWith('/')
            const commonProps = {
              className: 'door',
              style: { background: door.color || 'var(--blue)' },
            }
            const inner = (
              <>
                {door.tag && <span className="tag">{door.tag}</span>}
                <h3>{door.name}</h3>
                {door.description && <p>{door.description}</p>}
              </>
            )
            return internal ? (
              <Link key={i} to={door.link} {...commonProps}>{inner}</Link>
            ) : (
              <a key={i} href={door.link || '#'} target="_blank" rel="noopener noreferrer" {...commonProps}>{inner}</a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
