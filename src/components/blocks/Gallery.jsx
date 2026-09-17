export default function Gallery({ content }) {
  const { title, subtitle, items = [] } = content || {}
  if (items.length === 0) return null
  return (
    <section className="block-section">
      <div className="wrap">
        {(title || subtitle) && (
          <div className="section-head">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className="gallery-grid">
          {items.map((item, i) => (
            <figure className={`gallery-item span-${item.size || 'normal'}`} key={i}>
              {item.image_url && <img src={item.image_url} alt={item.caption || ''} />}
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
