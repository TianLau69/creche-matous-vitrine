export default function TextImage({ content }) {
  const { title, text, image_url, image_position = 'right' } = content || {}
  return (
    <section className={`block-section block-text-image ${image_position === 'left' ? 'reverse' : ''}`}>
      <div className="wrap">
        <div>
          {title && <h2>{title}</h2>}
          {text && <p>{text}</p>}
        </div>
        {image_url && <img src={image_url} alt={title || ''} />}
      </div>
    </section>
  )
}
