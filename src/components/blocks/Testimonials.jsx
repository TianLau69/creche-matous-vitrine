export default function Testimonials({ content }) {
  const { title, subtitle, items = [] } = content || {}
  if (items.length === 0) return null
  return (
    <section className="block-section block-testimonials">
      <div className="wrap">
        {(title || subtitle) && (
          <div className="section-head">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className="testimonial-grid">
          {items.map((item, i) => (
            <blockquote className="testimonial" key={i}>
              <p>&laquo;&nbsp;{item.quote}&nbsp;&raquo;</p>
              <footer>
                {item.photo_url && <img src={item.photo_url} alt="" />}
                <span>
                  <strong>{item.author}</strong>
                  {item.detail && <span className="muted-inline"> — {item.detail}</span>}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
