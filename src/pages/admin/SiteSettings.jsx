import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function SiteSettings() {
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }) => setSettings(data))
  }, [])

  async function save(e) {
    e.preventDefault()
    await supabase.from('site_settings').update(settings).eq('id', 1)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <p className="muted">Chargement…</p>

  return (
    <div>
      <p><Link to="/admin">← Toutes les pages</Link></p>
      <form className="admin-card" onSubmit={save}>
        <h1 style={{ fontSize: '1.3rem', marginBottom: 14 }}>Réglages du site</h1>

        <label>Tagline (affichée en pied de page)</label>
        <input type="text" value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />

        <div className="field-row">
          <div>
            <label>Email de contact</label>
            <input type="email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </div>
          <div>
            <label>Téléphone</label>
            <input type="tel" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </div>
        </div>

        <label>Facebook (lien complet)</label>
        <input type="text" value={settings.facebook_url || ''} onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })} />
        <label>Instagram (lien complet)</label>
        <input type="text" value={settings.instagram_url || ''} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} />
        <label>YouTube (lien complet)</label>
        <input type="text" value={settings.youtube_url || ''} onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })} />

        <button className="btn" type="submit" style={{ marginTop: 18 }}>Enregistrer</button>
        {saved && <span className="muted" style={{ marginLeft: 12 }}>Enregistré ✓</span>}
      </form>
    </div>
  )
}
