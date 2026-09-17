export default function Stats({ content }) {
  const { title, items = [] } = content || {}
  if (items.length === 0) return null
  return (
    <section className="block-section block-stats">
      <div className="wrap">
        {title && <div className="section-head" style={{ marginBottom: 34 }}><h2>{title}</h2></div>}
        <div className="stats-row">
          {items.map((item, i) => (
            <div className="stat" key={i}>
              <div className="stat-number">{item.number}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
