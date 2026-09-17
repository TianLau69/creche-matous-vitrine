export default function RichText({ content }) {
  const { title, text } = content || {}
  return (
    <section className="block-section block-rich-text">
      <div className="wrap">
        {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}
