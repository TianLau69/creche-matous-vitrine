import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PublicLayout({ children }) {
  const [navPages, setNavPages] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    supabase
      .from('pages')
      .select('slug, nav_label')
      .eq('show_in_nav', true)
      .eq('is_published', true)
      .order('nav_order', { ascending: true })
      .then(({ data }) => setNavPages(data || []))

    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setSettings(data))
  }, [])

  return (
    <>
      <header className="site-header">
        <nav className="wrap">
          <Link className="wordmark" to="/">Crèche <span>Matous</span></Link>
          <ul className="nav-links">
            {navPages.map((p) => (
              <li key={p.slug}>
                <Link to={p.slug === 'accueil' ? '/' : `/${p.slug}`}>{p.nav_label}</Link>
              </li>
            ))}
          </ul>
          <Link className="btn" to="/contact">Nous contacter</Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="wordmark">Crèche <span>Matous</span></div>
          {settings?.tagline && <p className="tagline">{settings.tagline}</p>}
          <div className="socials">
            {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {settings?.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">YouTube</a>}
          </div>
        </div>
      </footer>
    </>
  )
}
