import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function PagesList() {
  const [pages, setPages] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  async function load() {
    const { data } = await supabase.from('pages').select('*').order('nav_order', { ascending: true })
    setPages(data || [])
  }

  useEffect(() => { load() }, [])

  async function createPage(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const slug = slugify(newTitle)
    const maxOrder = pages.reduce((m, p) => Math.max(m, p.nav_order), -1)
    await supabase.from('pages').insert({
      slug,
      title: newTitle,
      nav_label: newTitle,
      nav_order: maxOrder + 1,
      show_in_nav: true,
      is_published: false,
    })
    setNewTitle('')
    setCreating(false)
    load()
  }

  async function togglePublish(page) {
    await supabase.from('pages').update({ is_published: !page.is_published }).eq('id', page.id)
    load()
  }

  async function toggleNav(page) {
    await supabase.from('pages').update({ show_in_nav: !page.show_in_nav }).eq('id', page.id)
    load()
  }

  async function deletePage(page) {
    if (page.slug === 'accueil') {
      alert("La page d'accueil ne peut pas être supprimée.")
      return
    }
    if (!confirm(`Supprimer la page "${page.title}" et tous ses blocs ? C'est définitif.`)) return
    await supabase.from('pages').delete().eq('id', page.id)
    load()
  }

  async function move(page, direction) {
    const idx = pages.findIndex((p) => p.id === page.id)
    const swapWith = pages[idx + direction]
    if (!swapWith) return
    await supabase.from('pages').update({ nav_order: swapWith.nav_order }).eq('id', page.id)
    await supabase.from('pages').update({ nav_order: page.nav_order }).eq('id', swapWith.id)
    load()
  }

  if (!pages) return <p className="muted">Chargement…</p>

  return (
    <div>
      <div className="admin-row" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem' }}>Pages du site</h1>
        <button className="btn small" onClick={() => setCreating(true)}>+ Nouvelle page</button>
      </div>

      {creating && (
        <form className="admin-card" onSubmit={createPage}>
          <label>Titre de la page</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ex. : À propos, Boutique, FAQ…"
            autoFocus
          />
          {newTitle && <p className="muted" style={{ marginTop: 8 }}>Adresse : /{slugify(newTitle)}</p>}
          <div className="modal-actions" style={{ marginTop: 14 }}>
            <button type="button" className="btn small ghost" onClick={() => setCreating(false)}>Annuler</button>
            <button type="submit" className="btn small">Créer la page</button>
          </div>
        </form>
      )}

      {pages.map((page, i) => (
        <div className="admin-card" key={page.id}>
          <div className="admin-row">
            <div>
              <strong>{page.title}</strong>{' '}
              <span className="muted">/{page.slug === 'accueil' ? '' : page.slug}</span>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="type-pill" style={{ color: page.is_published ? 'var(--green)' : 'var(--ink-soft)' }}>
                  {page.is_published ? 'Publiée' : 'Brouillon'}
                </span>
                <span className="type-pill">{page.show_in_nav ? 'Dans le menu' : 'Hors menu'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="icon-btn" onClick={() => move(page, -1)} disabled={i === 0} title="Monter">↑</button>
              <button className="icon-btn" onClick={() => move(page, 1)} disabled={i === pages.length - 1} title="Descendre">↓</button>
              <Link className="btn small" to={`/admin/pages/${page.id}`}>Modifier le contenu</Link>
              <button className="icon-btn" onClick={() => toggleNav(page)}>{page.show_in_nav ? 'Cacher du menu' : 'Afficher au menu'}</button>
              <button className="icon-btn" onClick={() => togglePublish(page)}>{page.is_published ? 'Dépublier' : 'Publier'}</button>
              {page.slug !== 'accueil' && (
                <button className="icon-btn" style={{ color: '#b3261e' }} onClick={() => deletePage(page)}>Supprimer</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
