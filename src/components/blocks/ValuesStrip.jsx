export default function ValuesStrip({ content }) {
  const items = content?.items || []
  if (items.length === 0) return null
  return (
    <div className="block-values">
      <div className="wrap">
        {items.map((item, i) => (
          <div className="item" key={i}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
