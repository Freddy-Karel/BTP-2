export type ImageAssetStatus = "provisional" | "validated" | "replace";

export type DefaultImageAsset = {
  key: string;
  area: string;
  label: string;
  originalUrl: string;
  status: ImageAssetStatus;
  sortOrder: number;
};

export const DEFAULT_IMAGE_ASSETS: DefaultImageAsset[] = [
  {
    key: "activity:electricite",
    area: "Activités",
    label: "Électricité HT / BT",
    originalUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 10,
  },
  {
    key: "activity:plomberie",
    area: "Activités",
    label: "Plomberie",
    originalUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 20,
  },
  {
    key: "activity:carrelage",
    area: "Activités",
    label: "Carrelage",
    originalUrl:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 30,
  },
  {
    key: "activity:maconnerie",
    area: "Activités",
    label: "Maçonnerie",
    originalUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 40,
  },
  {
    key: "activity:renovation",
    area: "Activités",
    label: "Rénovation de bâtiments",
    originalUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 50,
  },
  {
    key: "activity:rehabilitation",
    area: "Activités",
    label: "Réhabilitation de bâtiments",
    originalUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 60,
  },
  {
    key: "activity:revetement-sol",
    area: "Activités",
    label: "Revêtement de sol",
    originalUrl:
      "https://images.unsplash.com/photo-1595514535116-d0401260e7cf?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 70,
  },
  {
    key: "activity:revetement-mural",
    area: "Activités",
    label: "Revêtement mural",
    originalUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 80,
  },
  {
    key: "activity:faux-plafonds",
    area: "Activités",
    label: "Faux plafonds",
    originalUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 90,
  },
  {
    key: "activity:espaces-verts",
    area: "Activités",
    label: "Entretien d'espaces verts",
    originalUrl:
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 100,
  },
  {
    key: "activity:froid-clim",
    area: "Activités",
    label: "Froid et climatisation",
    originalUrl:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 110,
  },
  {
    key: "activity:vrd",
    area: "Activités",
    label: "VRD",
    originalUrl:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 120,
  },
  {
    key: "activity:bordures",
    area: "Activités",
    label: "Pose de bordures",
    originalUrl:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 130,
  },
  {
    key: "activity:profilage-laterite",
    area: "Activités",
    label: "Profilage de voie latéritique",
    originalUrl:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 140,
  },
  {
    key: "activity:assainissement",
    area: "Activités",
    label: "Assainissement",
    originalUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 150,
  },
  {
    key: "activity:terrassement",
    area: "Activités",
    label: "Terrassement",
    originalUrl:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 160,
  },
  {
    key: "activity:paves",
    area: "Activités",
    label: "Pose de pavés",
    originalUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 170,
  },
  {
    key: "activity:forage",
    area: "Activités",
    label: "Forage",
    originalUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=900&fit=crop&q=80",
    status: "provisional",
    sortOrder: 180,
  },
];

export const IMAGE_STATUS_LABEL: Record<ImageAssetStatus, string> = {
  provisional: "Provisoire",
  validated: "Validée",
  replace: "À remplacer",
};
