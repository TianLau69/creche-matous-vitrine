import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import BlockForm, { BLOCK_TYPES, newBlock } from './BlockForm'

const TYPE_LABEL = Object.fromEntries(BLOCK_TYPES.map((t) => [t.value, t.label]))

export default function PageEditor() {
  const { pageId } = useParams()
  const [page, setPage] = useState(null)
  const [blocks, setBlocks] = useState(null)
  const [editingBlock, setEditingBlock] = useState(null) // { ...block } en cours d'édition dans la modale
  const [addingType, setAddingType] = useState(BLOCK_TYPES[0].value)
  const [savingPage, setSavingPage] = useState(false)

  async function load() {
    const { data: p } = await supabase.from('pages').select('*').eq('id', pageId).single()
    const { data: b } = await supabase.from('blocks').select('*').eq('page_id', pageId).order('position', { ascending: true })
    setPage(p)
    setBlocks(b || [])
  }

  useEffect(() => { load() }, [pageId])

  async function savePageMeta(fields) {
    setSavingPage(true)
    await supabase.from('pages').update(fields).eq('id', pageId)
    setPage((p) => ({ ...p, ...fields }))
    setSavingPage(false)
  }

  async function addBlock() {
    const block = newBlock(addingType)
    const position = blocks.length
    const { data } = await supabase
      .from('blocks')
      .insert({ page_id: pageId, type: block.type, position, content: block.content })
      .select()
      .single()
    setBlocks([...blocks, data])
    setEditingBlock(data)
  }

  async function saveBlockContent(block, content) {
    await supabase.from('blocks').update({ content }).eq('id', block.id)
    setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, content } : b)))
    setEditingBlock(null)
  }

  async function deleteBlock(block) {
    if (!confirm('Retirer ce bloc de la page ?')) return
    await supabase.from('blocks').delete().eq('id', block.id)
    setBlocks(blocks.filter((b) => b.id !== block.id))
  }

  async function moveBlock(index, direction) {
    const j = index + direction
    if (j < 0 || j >= blocks.length) return
    const a = blocks[index]
    const b = blocks[j]
    await supabase.from('blocks').update({ position: b.position }).eq('id', a.id)
    await supabase.from('blocks').update({ position: a.position }).eq('id', b.id)
    const copy = [...blocks]
    ;[copy[index], copy[j]] = [copy[j], copy[index]]
    setBlocks(copy)
  }

  if (!page || !blocks) return <p className="muted">Chargement…</p>

  return (
    <div>
      <p><Link to="/admin">← Toutes les pages</Link></p>

      <div className="admin-card">
        <h1 style={{ fontSize: '1.3rem', marginBottom: 14 }}>Réglages de la page</h1>
        <label>Titre (onglet du navigateur)</label>
        <input type="text" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} onBlur={() => savePageMeta({ title: page.title })} />
        <label>Libellé dans le menu</label>
        <input type="text" value={page.nav_label} onChange={(e) => setPage({ ...page, nav_label: e.target.value })} onBlur={() => savePageMeta({ nav_label: page.nav_label })} />
        {page.slug !== 'accueil' && (
          <>
            <label>Adresse (slug)</label>
            <input type="text" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} onBlur={() => savePageMeta({ slug: page.slug })} />
          </>
        )}
        {savingPage && <p className="muted">Enregistrement…</p>}
      </div>

      <h2 style={{ fontSize: '1.15rem', margin: '28px 0 12px' }}>Contenu de la page</h2>

      {blocks.length === 0 && <p className="empty">Aucun bloc pour l'instant — ajoute-en un ci-dessous.</p>}

      {blocks.map((block, i) => (
        <div className="block-item" key={block.id}>
          <div className="admin-row">
            <span className="type-pill">{TYPE_LABEL[block.type] || block.type}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="icon-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0}>↑</button>
              <button className="icon-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}>↓</button>
              <button className="btn small" onClick={() => setEditingBlock(block)}>Modifier</button>
              <button className="icon-btn" style={{ color: '#b3261e' }} onClick={() => deleteBlock(block)}>Retirer</button>
            </div>
          </div>
        </div>
      ))}

      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-row">
          <select value={addingType} onChange={(e) => setAddingType(e.target.value)} style={{ maxWidth: 320 }}>
            {BLOCK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button className="btn" onClick={addBlock}>+ Ajouter ce bloc</button>
        </div>
      </div>

      {editingBlock && (
        <div className="modal-backdrop" onClick={() => setEditingBlock(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Modifier — {TYPE_LABEL[editingBlock.type]}</h2>
            <BlockForm
              type={editingBlock.type}
              content={editingBlock.content}
              onChange={(content) => setEditingBlock({ ...editingBlock, content })}
            />
            <div className="modal-actions">
              <button className="btn small ghost" onClick={() => setEditingBlock(null)}>Annuler</button>
              <button className="btn small" onClick={() => saveBlockContent(editingBlock, editingBlock.content)}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
