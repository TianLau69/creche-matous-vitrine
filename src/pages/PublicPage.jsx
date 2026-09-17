import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PublicLayout from '../components/PublicLayout'
import BlockRenderer from '../components/BlockRenderer'
import NotFound from './NotFound'

export default function PublicPage({ homeSlug = false }) {
  const { slug: paramSlug } = useParams()
  const slug = homeSlug ? 'accueil' : paramSlug

  const [state, setState] = useState({ loading: true, page: null, blocks: [] })

  useEffect(() => {
    let cancelled = false
    setState({ loading: true, page: null, blocks: [] })

    async function load() {
      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()

      if (!page) {
        if (!cancelled) setState({ loading: false, page: null, blocks: [] })
        return
      }

      const { data: blocks } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', page.id)
        .order('position', { ascending: true })

      if (!cancelled) {
        document.title = page.title || 'Crèche Matous'
        setState({ loading: false, page, blocks: blocks || [] })
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  if (state.loading) return null
  if (!state.page) return <NotFound />

  return (
    <PublicLayout>
      {state.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </PublicLayout>
  )
}
