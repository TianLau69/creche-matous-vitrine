# Crèche Matous — Site vitrine

Site vitrine public de crechematous.fr. **Projet séparé** du PWA de gestion pro/client
(`creche-matous-app`) — stack similaire (React + Vite + Supabase) mais un **Supabase
différent**, pour ne jamais mélanger les données clients/plannings avec le contenu du
site public.

Tout le contenu (textes, images, ordre des pages et des blocs) est stocké dans Supabase
et modifiable depuis `/admin`, sans toucher au code ni redéployer.

## Comment ça marche

- Chaque **page** (`pages` table) a un slug (`/nos-creches`), un titre, un libellé de menu.
- Chaque page contient une liste ordonnée de **blocs** (`blocks` table) : Hero, Bande de
  valeurs, Grille des crèches, Liste de services, Texte + image, Texte simple, Contact.
- Le rendu public lit ces tables et affiche les blocs dans l'ordre — voir
  `src/components/BlockRenderer.jsx`.
- `/admin` permet de créer des pages, ajouter/réordonner/modifier/supprimer des blocs,
  uploader des images, et changer les réglages globaux (tagline, contact, réseaux sociaux).

## 1. Mise en route (développement)

Comme pour le PWA, le plus simple est d'ouvrir ce dossier dans un **GitHub Codespace**
(ou en local si tu préfères).

```bash
npm install
```

### Créer le projet Supabase (dédié à la vitrine)

1. Sur [supabase.com](https://supabase.com), crée un **nouveau projet** (gratuit) —
   par exemple `creche-matous-vitrine`. Ne réutilise pas celui du PWA.
2. Dans l'éditeur SQL du projet, colle et exécute le contenu de `supabase/migration.sql`.
   Ce fichier est rejouable sans risque si tu dois le relancer plus tard.
3. Dans **Authentication > Users**, crée manuellement UN utilisateur (ton email +
   mot de passe) : c'est ton compte admin. Pas d'inscription publique, exprès.
4. Dans **Project Settings > API**, récupère l'URL du projet et la clé `anon public`.

### Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplis `.env.local` avec l'URL et la clé récupérées à l'étape précédente.

### Lancer le site

```bash
npm run dev
```

Le site est sur `http://localhost:5173`, l'admin sur `http://localhost:5173/admin`.

## 2. Déploiement (gratuit, autonome)

1. Pousse ce dossier sur un **nouveau repo GitHub** (ex. `creche-matous-vitrine`).
2. Sur [Vercel](https://vercel.com) (ou Netlify) : "New Project" → importe ce repo.
   - Build command : `npm run build`
   - Output directory : `dist`
   - Variables d'environnement : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
     (les mêmes que dans `.env.local`)
3. Une fois déployé, va dans les réglages du domaine du projet Vercel et ajoute
   `crechematous.fr` — Vercel te donne les enregistrements DNS à mettre chez ton
   registrar (là où tu paies le domaine, ~15-20€/an).
4. `vercel.json` (ou `public/_redirects` pour Netlify) est déjà en place pour que les
   URL comme `/nos-creches` fonctionnent correctement en production.

Après ça, **plus jamais besoin de redéployer pour changer du contenu** : tout se fait
depuis `/admin`, en live.

## 3. Utiliser l'admin au quotidien

- `/admin` → liste des pages. "+ Nouvelle page" crée une page en brouillon (pas visible
  publiquement tant que tu ne cliques pas sur "Publier").
- "Modifier le contenu" → ajoute/réordonne/édite les blocs de la page.
- Pour une nouvelle image : dans le bloc "Texte + image", le champ image propose un
  bouton d'upload direct (stocké dans Supabase Storage, gratuit jusqu'à 1 Go).
- "Réglages" (en haut) → tagline, email/téléphone, liens réseaux sociaux.

## Étendre le système plus tard

Ajouter un nouveau type de bloc :
1. Composant public dans `src/components/blocks/`
2. L'enregistrer dans `src/components/BlockRenderer.jsx`
3. Ajouter son formulaire dans `src/pages/admin/BlockForm.jsx` (+ entrée dans `BLOCK_TYPES`)

## Ce qui n'est PAS dans ce projet (volontairement)

- Pas de compte client, pas de réservation en ligne — c'est le rôle du PWA séparé.
- Pas de paiement en ligne.
- Pas de multi-utilisateur admin (un seul compte, créé manuellement dans Supabase).
