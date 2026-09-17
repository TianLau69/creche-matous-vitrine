// Petit jeu d'icônes en aplat, dans les couleurs de la charte.
// Utilisées par le bloc "service_list". Pour en ajouter une : lui donner une clé
// ici, elle apparaîtra automatiquement dans le menu déroulant de l'admin (BlockForm.jsx -> ICON_OPTIONS).

export const ICON_OPTIONS = [
  { value: 'cat', label: 'Chat / crèche' },
  { value: 'home', label: 'Maison / domicile' },
  { value: 'van', label: 'Navette / transport' },
  { value: 'paw', label: 'Patte' },
  { value: 'leaf', label: 'Feuille / nature' },
  { value: 'star', label: 'Étoile / VIP' },
]

export function ServiceIcon({ icon, color = 'var(--blue)' }) {
  switch (icon) {
    case 'home':
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M20 50 L50 24 L80 50" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="30" y="50" width="40" height="34" rx="4" fill={color}/>
          <circle cx="46" cy="66" r="4" fill="#fff"/>
        </svg>
      )
    case 'van':
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="10" y="46" width="66" height="26" rx="6" fill={color}/>
          <path d="M76 50 L92 50 L92 66 L76 66 Z" fill={color}/>
          <circle cx="30" cy="76" r="8" fill="var(--ink)"/>
          <circle cx="70" cy="76" r="8" fill="var(--ink)"/>
          <rect x="20" y="34" width="30" height="14" rx="4" fill={color} opacity="0.7"/>
        </svg>
      )
    case 'paw':
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="50" cy="68" rx="26" ry="18" fill={color}/>
          <circle cx="24" cy="42" r="10" fill={color}/>
          <circle cx="44" cy="28" r="10" fill={color}/>
          <circle cx="64" cy="28" r="10" fill={color}/>
          <circle cx="80" cy="44" r="10" fill={color}/>
        </svg>
      )
    case 'leaf':
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M20 80 Q20 20 80 20 Q80 80 20 80 Z" fill={color}/>
          <path d="M24 76 Q50 50 76 24" stroke="#fff" strokeWidth="4" fill="none" opacity="0.6"/>
        </svg>
      )
    case 'star':
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 12 L61 39 L90 40 L67 58 L75 86 L50 70 L25 86 L33 58 L10 40 L39 39 Z" fill={color}/>
        </svg>
      )
    case 'cat':
    default:
      return (
        <svg className="service-icon" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="14" y="38" width="72" height="48" rx="8" fill={color}/>
          <path d="M24 38 L50 16 L76 38" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M40 26 L34 12 L44 22 Z" fill={color}/>
          <path d="M60 26 L66 12 L56 22 Z" fill={color}/>
          <circle cx="50" cy="62" r="6" fill="#fff"/>
        </svg>
      )
  }
}
