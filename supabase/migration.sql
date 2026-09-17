-- ============================================================
-- Crèche Matous — Vitrine — migration.sql
-- Projet Supabase DÉDIÉ à la vitrine (séparé du Supabase du PWA pro/client).
-- Ce fichier est entièrement rejouable : if not exists / drop policy if exists partout.
-- ============================================================

-- 1. Extension pour les UUID
create extension if not exists "pgcrypto";

-- 2. Table des pages
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  nav_label text not null,
  nav_order integer not null default 0,
  show_in_nav boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Table des blocs (le contenu de chaque page, dans l'ordre)
--    type possibles : hero | values_strip | doors_grid | service_list | text_image | contact | rich_text
--    content : jsonb, structure libre selon le type (voir README.md)
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null,
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists blocks_page_id_idx on blocks(page_id);

-- 4. Réglages globaux du site (une seule ligne, singleton)
create table if not exists site_settings (
  id integer primary key default 1,
  tagline text not null default 'Votre crèche n''est pas la même sans votre matou.',
  email text,
  phone text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  constraint site_settings_singleton check (id = 1)
);

-- 5. Activation de la sécurité au niveau des lignes (RLS)
alter table pages enable row level security;
alter table blocks enable row level security;
alter table site_settings enable row level security;

-- 6. Lecture publique (le site vitrine n'a pas de compte utilisateur, tout le monde lit)
drop policy if exists "pages_public_select" on pages;
create policy "pages_public_select" on pages
  for select using (true);

drop policy if exists "blocks_public_select" on blocks;
create policy "blocks_public_select" on blocks
  for select using (true);

drop policy if exists "settings_public_select" on site_settings;
create policy "settings_public_select" on site_settings
  for select using (true);

-- 7. Écriture réservée aux utilisateurs connectés (= toi, via /admin)
drop policy if exists "pages_auth_write" on pages;
create policy "pages_auth_write" on pages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "blocks_auth_write" on blocks;
create policy "blocks_auth_write" on blocks
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "settings_auth_write" on site_settings;
create policy "settings_auth_write" on site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 8. Bucket de stockage pour les images uploadées depuis l'admin
insert into storage.buckets (id, name, public)
  select 'images', 'images', true
  where not exists (select 1 from storage.buckets where id = 'images');

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "images_auth_write" on storage.objects;
create policy "images_auth_write" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_auth_update" on storage.objects;
create policy "images_auth_update" on storage.objects
  for update using (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "images_auth_delete" on storage.objects;
create policy "images_auth_delete" on storage.objects
  for delete using (bucket_id = 'images' and auth.role() = 'authenticated');

-- 9. Réglages par défaut (une seule ligne)
insert into site_settings (id, tagline, email)
  select 1, 'Votre crèche n''est pas la même sans votre matou.', 'contact@crechematous.fr'
  where not exists (select 1 from site_settings where id = 1);

-- 10. Page d'accueil par défaut + contenu de départ (repris de la démo de présentation)
--     Protégé par "where not exists" : ne recrée rien si tu as déjà modifié le contenu.
do $$
declare
  home_id uuid;
begin
  select id into home_id from pages where slug = 'accueil';

  if home_id is null then
    insert into pages (slug, title, nav_label, nav_order, show_in_nav, is_published)
    values ('accueil', 'Crèche Matous', 'Accueil', 0, true, true)
    returning id into home_id;

    insert into blocks (page_id, type, position, content) values
    (home_id, 'hero', 0, '{
      "title": "Votre crèche n''est pas la même sans votre matou.",
      "subtitle": "Trois crèches félines à Lyon, une même exigence : un accueil chaleureux, professionnel, pensé pour le tempérament de chaque chat.",
      "primary_label": "Découvrir nos crèches",
      "primary_link": "/nos-creches",
      "secondary_label": "Nous contacter",
      "secondary_link": "/contact"
    }'::jsonb),
    (home_id, 'values_strip', 1, '{
      "items": [
        {"title": "Un accueil sur-mesure", "text": "Chaque chat a son propre rythme : nous adaptons l''espace et l''attention à sa personnalité."},
        {"title": "Une équipe qui connaît chaque matou", "text": "Suivi individuel, alimentation de qualité, jeux et câlins à volonté."},
        {"title": "Trois adresses, une même exigence", "text": "Feyzin, Pierre-Bénite / Oullins, Sainte-Foy-lès-Lyon : le même soin, partout."}
      ]
    }'::jsonb),
    (home_id, 'doors_grid', 2, '{
      "title": "Trois portes, une famille",
      "subtitle": "Où que vous soyez dans l''agglomération lyonnaise, une crèche Matous vous ouvre ses portes.",
      "items": [
        {"tag": "CRÈCHE", "name": "Feyzin", "description": "Boxes spacieux et espace jeux avec vue sur l''extérieur.", "color": "#004aad", "link": "/contact"},
        {"tag": "CRÈCHE", "name": "Pierre-Bénite / Oullins", "description": "Un cadre lumineux au calme, proche du Rhône.", "color": "#f69423", "link": "/contact"},
        {"tag": "CRÈCHE", "name": "Sainte-Foy-lès-Lyon", "description": "Notre plus ancienne adresse, forte de 5 ans d''expérience.", "color": "#74bb3f", "link": "/contact"}
      ]
    }'::jsonb),
    (home_id, 'service_list', 3, '{
      "title": "Nos services",
      "subtitle": "Trois façons de prendre soin de votre matou, selon vos besoins et les siens.",
      "items": [
        {"icon": "cat", "title": "Crèche féline", "description": "Boxes lumineux, fontaines à eau, espace jeux avec vue sur l''extérieur : balles, griffoirs, tunnels et cachettes, avec une présence disponible pour les jeux et les papouilles."},
        {"icon": "home", "title": "Crèche à domicile", "description": "Votre matou est très attaché à son territoire ? Une personne de confiance se déplace directement chez vous, le temps d''une journée, d''un week-end ou plus."},
        {"icon": "van", "title": "Crèche navette", "description": "Pas de véhicule ou emploi du temps chargé ? Nous venons chercher et ramenons votre matou entre son domicile et la crèche."}
      ]
    }'::jsonb),
    (home_id, 'contact', 4, '{
      "title": "Parlons de votre matou",
      "subtitle": "Une question, une envie de visiter une crèche ? Nous vous répondons avec plaisir.",
      "hours_text": "Du lundi au vendredi, de 9h à 18h.\nLe samedi, de 9h à 12h.\nVisites sur rendez-vous.",
      "email": "contact@crechematous.fr",
      "phone": "",
      "locations": [
        {"name": "Feyzin", "color": "#004aad", "note": "Prise de rendez-vous par téléphone ou par mail."},
        {"name": "Pierre-Bénite / Oullins", "color": "#f69423", "note": "Prise de rendez-vous par téléphone ou par mail."},
        {"name": "Sainte-Foy-lès-Lyon", "color": "#74bb3f", "note": "Prise de rendez-vous par téléphone ou par mail."}
      ]
    }'::jsonb);
  end if;

  -- Page contact dédiée (pour un lien /contact propre dans les CTA/nav)
  if not exists (select 1 from pages where slug = 'contact') then
    insert into pages (slug, title, nav_label, nav_order, show_in_nav, is_published)
    values ('contact', 'Contact — Crèche Matous', 'Contact', 2, true, true)
    returning id into home_id;

    insert into blocks (page_id, type, position, content)
    select home_id, b.type, b.position, b.content
    from blocks b join pages p on p.id = b.page_id
    where p.slug = 'accueil' and b.type = 'contact';
  end if;

  -- Page "Nos crèches" dédiée (pour le lien /nos-creches)
  if not exists (select 1 from pages where slug = 'nos-creches') then
    insert into pages (slug, title, nav_label, nav_order, show_in_nav, is_published)
    values ('nos-creches', 'Nos crèches — Crèche Matous', 'Nos crèches', 1, true, true)
    returning id into home_id;

    insert into blocks (page_id, type, position, content)
    select home_id, b.type, b.position, b.content
    from blocks b join pages p on p.id = b.page_id
    where p.slug = 'accueil' and b.type = 'doors_grid';
  end if;

  -- 11. Page "Boutique solidaire" — brouillon avec blocs vides, à compléter depuis /admin.
  --     is_published = false : invisible publiquement tant que tu ne cliques pas sur "Publier".
  if not exists (select 1 from pages where slug = 'boutique-solidaire') then
    insert into pages (slug, title, nav_label, nav_order, show_in_nav, is_published)
    values ('boutique-solidaire', 'Boutique solidaire — Crèche Matous', 'Boutique solidaire', 3, true, false)
    returning id into home_id;

    insert into blocks (page_id, type, position, content) values
    (home_id, 'rich_text', 0, '{
      "title": "Boutique solidaire",
      "text": "Chaque achat dans notre boutique solidaire soutient une cause animale locale. Page en préparation — texte, produits et partenaires à compléter depuis l''admin."
    }'::jsonb),
    (home_id, 'gallery', 1, '{
      "title": "Aperçu de la boutique",
      "subtitle": "",
      "items": [
        {"image_url": "", "caption": "", "size": "normal"},
        {"image_url": "", "caption": "", "size": "normal"},
        {"image_url": "", "caption": "", "size": "normal"}
      ]
    }'::jsonb);
  end if;
end $$;
