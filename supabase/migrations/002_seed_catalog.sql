-- Seed catalogue une seule fois (si tables vides)
insert into public.catalog_projects (title, location, image, category, year, sort_order)
select * from (values
  ('Rénovation — Pharmacie des Forestiers', 'Libreville', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=700&fit=crop&q=80', 'batiments', 2024, 1),
  ('Travaux — GONELEC', 'Libreville', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&h=700&fit=crop&q=80', 'travaux', 2024, 2),
  ('Aménagement — DGPE', 'Libreville', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&h=700&fit=crop&q=80', 'batiments', 2025, 3),
  ('Réhabilitation — IMP Conseils', 'Libreville', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=700&fit=crop&q=80', 'batiments', 2025, 4),
  ('Assainissement — Ministère des Eaux et Forêts', 'Libreville', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&h=700&fit=crop&q=80', 'travaux', 2025, 5),
  ('Rénovation — Direction Générale des Assurances', 'Libreville', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=700&fit=crop&q=80', 'batiments', 2024, 6),
  ('Terrassement — Zone industrielle Owendo', 'Owendo', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=700&fit=crop&q=80', 'travaux', 2025, 7),
  ('Réhabilitation bureaux — Akanda', 'Akanda', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=700&fit=crop&q=80', 'batiments', 2025, 8),
  ('VRD & accès — lotissement résidentiel', 'Libreville', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=900&h=700&fit=crop&q=80', 'travaux', 2024, 9),
  ('Rénovation intérieure — particulier', 'Libreville', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&h=700&fit=crop&q=80', 'batiments', 2025, 10),
  ('Forage & adduction d''eau', 'Estuaire', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&h=700&fit=crop&q=80', 'travaux', 2024, 11),
  ('Mise aux normes électriques — local commercial', 'Libreville', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&h=700&fit=crop&q=80', 'batiments', 2025, 12),
  ('Pavage parking & allées', 'Libreville', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=900&h=700&fit=crop&q=80', 'travaux', 2025, 13),
  ('Réhabilitation façade — immeuble de bureaux', 'Libreville', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=700&fit=crop&q=80', 'batiments', 2024, 14)
) as v(title, location, image, category, year, sort_order)
where not exists (select 1 from public.catalog_projects limit 1);

insert into public.catalog_projects
  (title, location, image, images, description, category, year, client, sort_order, published)
select * from (values
  (
    'Amenagement d''une fenetre - salle IT OCT',
    'Salle IT / open space',
    '/rapports/fenetre-salle-it/02.png',
    array['/rapports/fenetre-salle-it/01.png','/rapports/fenetre-salle-it/02.png','/rapports/fenetre-salle-it/03.png']::text[],
    'Installation d''une fenetre coulissante dans la salle open space des IT, documentee par rapport de travaux.',
    'batiments', 2026, 'OCT', 15, true
  ),
  (
    'Amenagement d''un abri bus - OCT zone U',
    'Zone U - conteneur transforme',
    '/rapports/abri-bus-zone-u/02.png',
    array['/rapports/abri-bus-zone-u/01.png','/rapports/abri-bus-zone-u/02.png','/rapports/abri-bus-zone-u/03.png']::text[],
    'Transformation d''un conteneur accidente en abri bus sur site OCT.',
    'travaux', 2026, 'OCT', 16, true
  ),
  (
    'Grilles et bordures de caniveaux - OCT T1',
    'Terminal 1 - zone frigo',
    '/rapports/grilles-bordures-caniveaux-t1/04.png',
    array['/rapports/grilles-bordures-caniveaux-t1/01.png','/rapports/grilles-bordures-caniveaux-t1/02.png','/rapports/grilles-bordures-caniveaux-t1/03.png','/rapports/grilles-bordures-caniveaux-t1/04.png','/rapports/grilles-bordures-caniveaux-t1/05.png','/rapports/grilles-bordures-caniveaux-t1/06.png']::text[],
    'Remplacement des grilles et bordures de caniveaux au Terminal 1, zone frigo.',
    'travaux', 2026, 'OCT', 17, true
  ),
  (
    'Double evier industriel - OCT T1',
    'Terminal 1 - pres de l''infirmerie',
    '/rapports/double-evier-industriel-t1/03.png',
    array['/rapports/double-evier-industriel-t1/01.png','/rapports/double-evier-industriel-t1/02.png','/rapports/double-evier-industriel-t1/03.png','/rapports/double-evier-industriel-t1/04.png']::text[],
    'Renovation du lave-mains avec installation d''un double evier industriel.',
    'batiments', 2026, 'OCT', 18, true
  ),
  (
    'Amenagement conteneur archives DRH - OCT',
    'Conteneur archives DRH',
    '/rapports/conteneur-archives-drh/03.png',
    array['/rapports/conteneur-archives-drh/01.png','/rapports/conteneur-archives-drh/02.png','/rapports/conteneur-archives-drh/03.png','/rapports/conteneur-archives-drh/04.png','/rapports/conteneur-archives-drh/05.png']::text[],
    'Amenagement d''un espace d''archives DRH avec fermetures, porte coulissante et finitions.',
    'batiments', 2026, 'OCT', 19, true
  ),
  (
    'Evier industriel - OCT T1 zone frigo',
    'Terminal 1 - zone frigo',
    '/rapports/evier-industriel-t1/03.png',
    array['/rapports/evier-industriel-t1/01.png','/rapports/evier-industriel-t1/02.png','/rapports/evier-industriel-t1/03.png','/rapports/evier-industriel-t1/04.png']::text[],
    'Renovation du lave-mains avec installation d''un evier industriel au Terminal 1.',
    'batiments', 2026, 'OCT', 20, true
  )
) as v(title, location, image, images, description, category, year, client, sort_order, published)
where not exists (
  select 1 from public.catalog_projects p
  where p.title = v.title and coalesce(p.client, '') = v.client
);

insert into public.catalog_reports (
  id, slug, title, client, client_slug, location, category, objective,
  start_date, end_date, start_label, end_label, refs, before_images, after_images, cover, sort_order
)
select * from (values
  (
    'fenetre-salle-it', 'fenetre-salle-it',
    'Aménagement d''une fenêtre — salle IT', 'OCT', 'oct', 'Salle IT / open space', 'batiments',
    'Installer une fenêtre coulissante dans la salle open space des IT, dans le respect des règles QHSE (délai 1 jour). BDC OCT N°5004.',
    '2026-03-25', '2026-03-25', '25/03/2026', '25/03/2026',
    array['BDC OCT N°5004']::text[],
    array['/rapports/fenetre-salle-it/01.png']::text[],
    array['/rapports/fenetre-salle-it/02.png','/rapports/fenetre-salle-it/03.png']::text[],
    '/rapports/fenetre-salle-it/02.png', 1
  ),
  (
    'abri-bus-zone-u', 'abri-bus-zone-u',
    'Aménagement d''un abri bus', 'OCT', 'oct', 'Zone U — conteneur transformé', 'travaux',
    'Transformer un conteneur accidenté (zone U) en abri bus, dans le respect des règles QHSE (délai 10 jours). BDC OCT N°4430.',
    '2026-03-12', '2026-03-19', '12/03/2026', '19/03/2026',
    array['BDC OCT N°4430']::text[],
    array['/rapports/abri-bus-zone-u/01.png']::text[],
    array['/rapports/abri-bus-zone-u/02.png','/rapports/abri-bus-zone-u/03.png']::text[],
    '/rapports/abri-bus-zone-u/02.png', 2
  ),
  (
    'grilles-bordures-caniveaux-t1', 'grilles-bordures-caniveaux-t1',
    'Installation de grilles et bordures de caniveaux', 'OCT', 'oct', 'Terminal 1 — zone frigo', 'travaux',
    'Remplacer les grilles et bordures de caniveaux au Terminal 1 (zone frigo), dans le respect des règles QHSE (délai 7 jours). BDC OCT N°4291 et 4292.',
    '2026-03-11', '2026-03-14', '11/03/2026', '14/03/2026',
    array['BDC OCT N°4291','BDC OCT N°4292']::text[],
    array['/rapports/grilles-bordures-caniveaux-t1/01.png','/rapports/grilles-bordures-caniveaux-t1/02.png','/rapports/grilles-bordures-caniveaux-t1/03.png']::text[],
    array['/rapports/grilles-bordures-caniveaux-t1/04.png','/rapports/grilles-bordures-caniveaux-t1/05.png','/rapports/grilles-bordures-caniveaux-t1/06.png']::text[],
    '/rapports/grilles-bordures-caniveaux-t1/04.png', 3
  ),
  (
    'double-evier-industriel-t1', 'double-evier-industriel-t1',
    'Installation d''un double évier industriel — T1', 'OCT', 'oct', 'Terminal 1 — près de l''infirmerie', 'batiments',
    'Rénover le lave-mains (double évier) au Terminal 1, à côté de l''infirmerie, dans le respect des règles QHSE (délai 3 jours). BDC OCT N°4264.',
    '2026-02-23', '2026-02-25', '23/02/2026', '25/02/2026',
    array['BDC OCT N°4264']::text[],
    array['/rapports/double-evier-industriel-t1/01.png','/rapports/double-evier-industriel-t1/02.png']::text[],
    array['/rapports/double-evier-industriel-t1/03.png','/rapports/double-evier-industriel-t1/04.png']::text[],
    '/rapports/double-evier-industriel-t1/03.png', 4
  ),
  (
    'conteneur-archives-drh', 'conteneur-archives-drh',
    'Aménagement conteneur archives DRH', 'OCT', 'oct', 'Conteneur archives DRH', 'batiments',
    'Aménager un espace du conteneur archives DRH (fermetures, porte coulissante, finitions), dans le respect des règles QHSE (délai 5 jours). BDC OCT N°4143.',
    '2026-02-20', '2026-02-23', '20/02/2026', '23/02/2026',
    array['BDC OCT N°4143']::text[],
    array['/rapports/conteneur-archives-drh/01.png','/rapports/conteneur-archives-drh/02.png']::text[],
    array['/rapports/conteneur-archives-drh/03.png','/rapports/conteneur-archives-drh/04.png','/rapports/conteneur-archives-drh/05.png']::text[],
    '/rapports/conteneur-archives-drh/03.png', 5
  ),
  (
    'evier-industriel-t1', 'evier-industriel-t1',
    'Installation d''un évier industriel — T1', 'OCT', 'oct', 'Terminal 1 — zone frigo', 'batiments',
    'Rénover le lave-mains (évier industriel) au Terminal 1, zone frigo, dans le respect des règles QHSE (délai 7 jours). BDC OCT N°4045.',
    '2026-02-12', '2026-02-16', '12/02/2026', '16/02/2026',
    array['BDC OCT N°4045']::text[],
    array['/rapports/evier-industriel-t1/01.png','/rapports/evier-industriel-t1/02.png']::text[],
    array['/rapports/evier-industriel-t1/03.png','/rapports/evier-industriel-t1/04.png']::text[],
    '/rapports/evier-industriel-t1/03.png', 6
  )
) as v(
  id, slug, title, client, client_slug, location, category, objective,
  start_date, end_date, start_label, end_label, refs, before_images, after_images, cover, sort_order
)
where not exists (select 1 from public.catalog_reports limit 1);
