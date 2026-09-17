import { Link } from 'react-router-dom'

function isInternal(link) {
  return link && link.startsWith('/')
}

function CtaLink({ label, link, className }) {
  if (!label || !link) return null
  return isInternal(link)
    ? <Link className={className} to={link}>{label}</Link>
    : <a className={className} href={link} target="_blank" rel="noopener noreferrer">{label}</a>
}

export default function Hero({ content }) {
  const { title, subtitle, primary_label, primary_link, secondary_label, secondary_link } = content || {}
  return (
    <section className="block-hero">
      <div className="wrap">
        <div>
          {title && <h1>{title}</h1>}
          {subtitle && <p className="lede">{subtitle}</p>}
          <div className="actions">
            <CtaLink className="btn" label={primary_label} link={primary_link} />
            <CtaLink className="btn ghost" label={secondary_label} link={secondary_link} />
          </div>
        </div>
        <div aria-hidden="true">
          <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="340" height="360" rx="18" fill="var(--paper)" stroke="var(--line)" strokeWidth="2"/>
            <rect x="70" y="60" width="280" height="180" rx="10" fill="#eaf3ff"/>
            <circle cx="290" cy="100" r="34" fill="var(--orange)" opacity="0.9"/>
            <rect x="80" y="70" width="6" height="160" fill="var(--blue)" opacity="0.35"/>
            <rect x="86" y="70" width="256" height="6" fill="var(--blue)" opacity="0.35"/>
            <path d="M96 236 Q140 150 210 236 Q270 150 334 236 Z" fill="var(--green)" opacity="0.85"/>
            <ellipse cx="215" cy="300" rx="86" ry="14" fill="var(--ink)" opacity="0.06"/>
            <g transform="translate(150,215)">
              <ellipse cx="60" cy="78" rx="52" ry="30" fill="var(--ink)"/>
              <circle cx="20" cy="42" r="30" fill="var(--ink)"/>
              <path d="M2 24 L10 2 L22 20 Z" fill="var(--ink)"/>
              <path d="M38 24 L30 2 L18 20 Z" fill="var(--ink)"/>
              <circle cx="12" cy="44" r="3.2" fill="var(--paper)"/>
              <circle cx="26" cy="44" r="3.2" fill="var(--paper)"/>
              <path d="M14 52 Q19 57 24 52" stroke="var(--paper)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M108 92 Q136 70 128 30" stroke="var(--ink)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            </g>
            <rect x="150" y="330" width="16" height="40" rx="4" fill="var(--green)"/>
            <ellipse cx="158" cy="322" rx="26" ry="16" fill="var(--green)" opacity="0.75"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
