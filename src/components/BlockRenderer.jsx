import Hero from './blocks/Hero'
import ValuesStrip from './blocks/ValuesStrip'
import DoorsGrid from './blocks/DoorsGrid'
import ServiceList from './blocks/ServiceList'
import TextImage from './blocks/TextImage'
import RichText from './blocks/RichText'
import ContactBlock from './blocks/ContactBlock'
import Gallery from './blocks/Gallery'
import Stats from './blocks/Stats'
import Testimonials from './blocks/Testimonials'

// Pour ajouter un nouveau type de bloc :
// 1. Créer le composant dans src/components/blocks/
// 2. L'ajouter ici
// 3. Ajouter son formulaire dans src/pages/admin/BlockForm.jsx et l'entrée dans BLOCK_TYPES
const REGISTRY = {
  hero: Hero,
  values_strip: ValuesStrip,
  doors_grid: DoorsGrid,
  service_list: ServiceList,
  text_image: TextImage,
  rich_text: RichText,
  contact: ContactBlock,
  gallery: Gallery,
  stats: Stats,
  testimonials: Testimonials,
}

export default function BlockRenderer({ block }) {
  const Component = REGISTRY[block.type]
  if (!Component) {
    console.warn(`Type de bloc inconnu : ${block.type}`)
    return null
  }
  return <Component content={block.content} />
}
