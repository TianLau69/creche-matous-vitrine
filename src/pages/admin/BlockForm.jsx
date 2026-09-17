import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ICON_OPTIONS } from '../../components/blocks/icons'

export const BLOCK_TYPES = [
  { value: 'hero', label: 'En-tête (Hero)' },
  { value: 'values_strip', label: 'Bande de valeurs (2 à 4 phrases courtes)' },
  { value: 'doors_grid', label: 'Grille des crèches ("portes")' },
  { value: 'service_list', label: 'Liste de services' },
  { value: 'text_image', label: 'Texte + image' },
  { value: 'rich_text', label: 'Texte simple' },
  { value: 'contact', label: 'Bloc contact' },
]

const BRAND_COLORS = [
  { value: '#004aad', label: 'Bleu (Feyzin)' },
  { value: '#f69423', label: 'Orange (Oullins)' },
  { value: '#74bb3f', label: 'Vert (Sainte-Foy)' },
]

function defaultContentFor(type) {
  switch (type) {
    case 'hero':
      return { title: '', subtitle: '', primary_label: '', primary_link: '', secondary_label: '', secondary_link: '' }
    case 'values_strip':
      return { items: [{ title: '', text: '' }] }
    case 'doors_grid':
      return { title: '', subtitle: '', items: [{ tag: 'CRÈCHE', name: '', description: '', color: '#004aad', link: '/contact' }] }
    case 'service_list':
      return { title: '', subtitle: '', items: [{ icon: 'cat', title: '', description: '' }] }
    case 'text_image':
      return { title: '', text: '', image_url: '', image_position: 'right' }
    case 'rich_text':
      return { title: '', text: '' }
    case 'contact':
      return { title: '', subtitle: '', hours_text: '', email: '', phone: '', locations: [{ name: '', color: '#004aad', note: '' }] }
    default:
      return {}
  }
}

export function newBlock(type) {
  return { type, content: defaultContentFor(type) }
}

// ---- petits utilitaires pour les listes (items d'un bloc) ----
function useListHelpers(content, onChange, key) {
  const items = content[key] || []
  const set = (newItems) => onChange({ ...content, [key]: newItems })
  return {
    items,
    update: (i, field, value) => set(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it))),
    add: (blank) => set([...items, blank]),
    remove: (i) => set(items.filter((_, idx) => idx !== i)),
    move: (i, dir) => {
      const j = i + dir
      if (j < 0 || j >= items.length) return
      const copy = [...items]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      set(copy)
    },
  }
}

function ItemControls({ onUp, onDown, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 8 }}>
      <button type="button" className="icon-btn" onClick={onUp}>↑</button>
      <button type="button" className="icon-btn" onClick={onDown}>↓</button>
      <button type="button" className="icon-btn" style={{ color: '#b3261e' }} onClick={onRemove}>Retirer</button>
    </div>
  )
}

function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
    const { error: uploadError } = await supabase.storage.from('images').upload(path, file)
    if (uploadError) {
      setError("Échec de l'upload : " + uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      {value && <img src={value} alt="" style={{ maxWidth: 200, borderRadius: 8, marginBottom: 10 }} />}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {uploading && <p className="muted">Envoi en cours…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default function BlockForm({ type, content, onChange }) {
  if (!content) return null

  if (type === 'hero') {
    return (
      <>
        <label>Titre</label>
        <textarea value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Sous-titre</label>
        <textarea value={content.subtitle || ''} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} />
        <div className="field-row">
          <div>
            <label>Bouton principal — texte</label>
            <input type="text" value={content.primary_label || ''} onChange={(e) => onChange({ ...content, primary_label: e.target.value })} />
          </div>
          <div>
            <label>Bouton principal — lien</label>
            <input type="text" value={content.primary_link || ''} onChange={(e) => onChange({ ...content, primary_link: e.target.value })} placeholder="/nos-creches" />
          </div>
        </div>
        <div className="field-row">
          <div>
            <label>Bouton secondaire — texte</label>
            <input type="text" value={content.secondary_label || ''} onChange={(e) => onChange({ ...content, secondary_label: e.target.value })} />
          </div>
          <div>
            <label>Bouton secondaire — lien</label>
            <input type="text" value={content.secondary_link || ''} onChange={(e) => onChange({ ...content, secondary_link: e.target.value })} placeholder="/contact" />
          </div>
        </div>
      </>
    )
  }

  if (type === 'values_strip') {
    const list = useListHelpers(content, onChange, 'items')
    return (
      <>
        <p className="muted">2 à 4 phrases courtes fonctionnent le mieux.</p>
        {list.items.map((item, i) => (
          <div className="repeat-item" key={i}>
            <label>Titre</label>
            <input type="text" value={item.title || ''} onChange={(e) => list.update(i, 'title', e.target.value)} />
            <label>Texte</label>
            <textarea value={item.text || ''} onChange={(e) => list.update(i, 'text', e.target.value)} />
            <ItemControls onUp={() => list.move(i, -1)} onDown={() => list.move(i, 1)} onRemove={() => list.remove(i)} />
          </div>
        ))}
        <button type="button" className="btn small ghost" onClick={() => list.add({ title: '', text: '' })}>+ Ajouter une phrase</button>
      </>
    )
  }

  if (type === 'doors_grid') {
    const list = useListHelpers(content, onChange, 'items')
    return (
      <>
        <label>Titre de la section</label>
        <input type="text" value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Sous-titre</label>
        <textarea value={content.subtitle || ''} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} />
        {list.items.map((item, i) => (
          <div className="repeat-item" key={i}>
            <label>Nom de la crèche</label>
            <input type="text" value={item.name || ''} onChange={(e) => list.update(i, 'name', e.target.value)} />
            <label>Étiquette (petit texte au-dessus, ex. "CRÈCHE")</label>
            <input type="text" value={item.tag || ''} onChange={(e) => list.update(i, 'tag', e.target.value)} />
            <label>Description courte</label>
            <textarea value={item.description || ''} onChange={(e) => list.update(i, 'description', e.target.value)} />
            <div className="field-row">
              <div>
                <label>Couleur</label>
                <select value={item.color || '#004aad'} onChange={(e) => list.update(i, 'color', e.target.value)}>
                  {BRAND_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label>Lien (ex. /contact)</label>
                <input type="text" value={item.link || ''} onChange={(e) => list.update(i, 'link', e.target.value)} />
              </div>
            </div>
            <ItemControls onUp={() => list.move(i, -1)} onDown={() => list.move(i, 1)} onRemove={() => list.remove(i)} />
          </div>
        ))}
        <button type="button" className="btn small ghost" onClick={() => list.add({ tag: 'CRÈCHE', name: '', description: '', color: '#004aad', link: '/contact' })}>
          + Ajouter une crèche
        </button>
      </>
    )
  }

  if (type === 'service_list') {
    const list = useListHelpers(content, onChange, 'items')
    return (
      <>
        <label>Titre de la section</label>
        <input type="text" value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Sous-titre</label>
        <textarea value={content.subtitle || ''} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} />
        {list.items.map((item, i) => (
          <div className="repeat-item" key={i}>
            <label>Icône</label>
            <select value={item.icon || 'cat'} onChange={(e) => list.update(i, 'icon', e.target.value)}>
              {ICON_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <label>Titre du service</label>
            <input type="text" value={item.title || ''} onChange={(e) => list.update(i, 'title', e.target.value)} />
            <label>Description</label>
            <textarea value={item.description || ''} onChange={(e) => list.update(i, 'description', e.target.value)} />
            <ItemControls onUp={() => list.move(i, -1)} onDown={() => list.move(i, 1)} onRemove={() => list.remove(i)} />
          </div>
        ))}
        <button type="button" className="btn small ghost" onClick={() => list.add({ icon: 'cat', title: '', description: '' })}>
          + Ajouter un service
        </button>
      </>
    )
  }

  if (type === 'text_image') {
    return (
      <>
        <label>Titre</label>
        <input type="text" value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Texte</label>
        <textarea value={content.text || ''} onChange={(e) => onChange({ ...content, text: e.target.value })} />
        <label>Image</label>
        <ImageUploadField value={content.image_url} onChange={(url) => onChange({ ...content, image_url: url })} />
        <label>Position de l'image</label>
        <select value={content.image_position || 'right'} onChange={(e) => onChange({ ...content, image_position: e.target.value })}>
          <option value="right">À droite</option>
          <option value="left">À gauche</option>
        </select>
      </>
    )
  }

  if (type === 'rich_text') {
    return (
      <>
        <label>Titre (optionnel)</label>
        <input type="text" value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Texte</label>
        <textarea rows={6} value={content.text || ''} onChange={(e) => onChange({ ...content, text: e.target.value })} />
      </>
    )
  }

  if (type === 'contact') {
    const list = useListHelpers(content, onChange, 'locations')
    return (
      <>
        <label>Titre</label>
        <input type="text" value={content.title || ''} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        <label>Sous-titre</label>
        <textarea value={content.subtitle || ''} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} />
        <label>Horaires (une ligne = un retour à la ligne)</label>
        <textarea value={content.hours_text || ''} onChange={(e) => onChange({ ...content, hours_text: e.target.value })} />
        <div className="field-row">
          <div>
            <label>Email</label>
            <input type="email" value={content.email || ''} onChange={(e) => onChange({ ...content, email: e.target.value })} />
          </div>
          <div>
            <label>Téléphone (optionnel)</label>
            <input type="tel" value={content.phone || ''} onChange={(e) => onChange({ ...content, phone: e.target.value })} />
          </div>
        </div>
        <p style={{ marginTop: 18, fontWeight: 700 }}>Établissements</p>
        {list.items.map((item, i) => (
          <div className="repeat-item" key={i}>
            <label>Nom</label>
            <input type="text" value={item.name || ''} onChange={(e) => list.update(i, 'name', e.target.value)} />
            <div className="field-row">
              <div>
                <label>Couleur</label>
                <select value={item.color || '#004aad'} onChange={(e) => list.update(i, 'color', e.target.value)}>
                  {BRAND_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <label>Note</label>
            <input type="text" value={item.note || ''} onChange={(e) => list.update(i, 'note', e.target.value)} />
            <ItemControls onUp={() => list.move(i, -1)} onDown={() => list.move(i, 1)} onRemove={() => list.remove(i)} />
          </div>
        ))}
        <button type="button" className="btn small ghost" onClick={() => list.add({ name: '', color: '#004aad', note: '' })}>
          + Ajouter un établissement
        </button>
      </>
    )
  }

  return <p className="muted">Type de bloc inconnu.</p>
}
