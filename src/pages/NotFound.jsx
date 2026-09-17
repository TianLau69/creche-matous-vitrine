import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 40 }}>
      <h1 style={{ fontSize: '2rem' }}>Page introuvable</h1>
      <p style={{ color: 'var(--ink-soft)' }}>Cette page n'existe pas ou plus.</p>
      <Link className="btn" to="/">Retour à l'accueil</Link>
    </div>
  )
}
