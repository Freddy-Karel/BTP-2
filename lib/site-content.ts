export type HeroContent = {
  brandLabel: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  locationLine: string;
  cityLine: string;
};

export type ContactContent = {
  sectionTitle: string;
  sectionSubtitle: string;
  email: string;
  whatsapp: string;
  phone1: string;
  phone2: string;
  facebookPageId: string;
  address: string;
  mapQuery: string;
};

export type AboutContent = {
  title: string;
  paragraph1: string;
  paragraph2: string;
  bullets: string[];
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    brandLabel: "ALLIANCE M.O BTP",
    titleLine1: "Des travaux solides,",
    titleLine2: "une entreprise de confiance",
    subtitle:
      "ALLIANCE M.O BTP construit, rénove et réhabilite vos bâtiments avec sérieux. De l'étude à la réalisation, notre équipe vous accompagne à chaque étape.",
    locationLine: "Bâtiment · Rénovation · Travaux publics",
    cityLine: "Libreville, Gabon",
  },
  about: {
    title: "Une entreprise gabonaise au service de vos projets",
    paragraph1:
      "ALLIANCE M.O BTP est une SARL créée en 2024, basée à l'Ancienne Sobraga (Libreville). Nous intervenons sur les bâtiments (construction, rénovation, réhabilitation) et les travaux publics (VRD, terrassement, assainissement, forage…).",
    paragraph2:
      "Notre ambition : offrir une image sérieuse et fiable, avec un accompagnement clair de l'étude à la réalisation.",
    bullets: [
      "Clients privés, entreprises et administrations",
      "Chantiers suivis avec rigueur et transparence",
      "Équipes polyvalentes et matériel professionnel",
    ],
  },
  contact: {
    sectionTitle: "Parlons de votre projet",
    sectionSubtitle:
      "Téléphone, WhatsApp, Facebook Messenger ou formulaire — réponse rapide.",
    email: "okedomi@gmail.com",
    whatsapp: "24162712263",
    phone1: "+241 62 71 22 63",
    phone2: "+241 77 06 76 88",
    facebookPageId: "OKEDOMI",
    address: "Ancienne Sobraga, Libreville, Gabon",
    mapQuery: "Ancienne Sobraga, Libreville, Gabon",
  },
};

/** Numéro WhatsApp normalisé (chiffres uniquement) */
export function normalizeWhatsAppPhone(whatsapp: string) {
  return String(whatsapp).replace(/\D/g, "");
}

/**
 * Lien deep-link app WhatsApp (bypass DNS wa.me / api.whatsapp.com).
 * Fonctionne si l’app est installée (surtout mobile).
 */
export function whatsappAppUrlFrom(
  whatsapp: string,
  message = "Bonjour ALLIANCE M.O BTP, je souhaite des informations sur vos services.",
) {
  const phone = normalizeWhatsAppPhone(whatsapp);
  const params = new URLSearchParams({ phone, text: message });
  return `whatsapp://send?${params.toString()}`;
}

/**
 * Lien web WhatsApp (navigateur / WhatsApp Web).
 * Utilise api.whatsapp.com plutôt que wa.me.
 */
export function whatsappUrlFrom(
  whatsapp: string,
  message = "Bonjour ALLIANCE M.O BTP, je souhaite des informations sur vos services.",
) {
  const phone = normalizeWhatsAppPhone(whatsapp);
  const params = new URLSearchParams({ phone, text: message });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/** SMS prérempli — marche même si WhatsApp / DNS bloqués */
export function smsUrlFrom(phoneDisplay: string, message: string) {
  let digits = phoneDisplay.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+") && digits.startsWith("241")) digits = `+${digits}`;
  if (!digits.startsWith("+")) digits = `+241${digits.replace(/^0/, "")}`;
  return `sms:${digits}?body=${encodeURIComponent(message)}`;
}

/** Messenger — domaine facebook.com (évite m.me si DNS bloqué) */
export function facebookMessengerUrlFrom(pageId: string) {
  const id = String(pageId).trim().replace(/^@/, "");
  return `https://www.facebook.com/messages/t/${encodeURIComponent(id)}`;
}

/** Lien téléphone — normalise +241… */
export function phoneTelHref(phone: string) {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith("+") && digits.startsWith("241")) {
    digits = `+${digits}`;
  }
  if (!digits.startsWith("+") && digits.length >= 8) {
    digits = `+241${digits.replace(/^0/, "")}`;
  }
  return `tel:${digits}`;
}

/**
 * Ouvre WhatsApp : d’abord l’app (whatsapp://), sinon le lien web.
 * À appeler côté client uniquement.
 */
export function openWhatsApp(
  whatsapp: string,
  message = "Bonjour ALLIANCE M.O BTP, je souhaite des informations sur vos services.",
) {
  const appUrl = whatsappAppUrlFrom(whatsapp, message);
  const webUrl = whatsappUrlFrom(whatsapp, message);
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (mobile) {
    // Tente l’app ; si elle n’est pas là, bascule vers le web après un court délai
    const started = Date.now();
    window.location.href = appUrl;
    window.setTimeout(() => {
      if (Date.now() - started < 2000) {
        window.location.href = webUrl;
      }
    }, 1200);
    return true;
  }

  const win = window.open(webUrl, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.href = webUrl;
  }
  return !!win;
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function mergeHero(raw: unknown): HeroContent {
  const base = DEFAULT_SITE_CONTENT.hero;
  if (!isRecord(raw)) return base;
  return {
    brandLabel: String(raw.brandLabel ?? base.brandLabel),
    titleLine1: String(raw.titleLine1 ?? base.titleLine1),
    titleLine2: String(raw.titleLine2 ?? base.titleLine2),
    subtitle: String(raw.subtitle ?? base.subtitle),
    locationLine: String(raw.locationLine ?? base.locationLine),
    cityLine: String(raw.cityLine ?? base.cityLine),
  };
}

export function mergeAbout(raw: unknown): AboutContent {
  const base = DEFAULT_SITE_CONTENT.about;
  if (!isRecord(raw)) return base;
  const bullets = Array.isArray(raw.bullets)
    ? raw.bullets.map((b) => String(b)).filter(Boolean)
    : base.bullets;
  return {
    title: String(raw.title ?? base.title),
    paragraph1: String(raw.paragraph1 ?? base.paragraph1),
    paragraph2: String(raw.paragraph2 ?? base.paragraph2),
    bullets: bullets.length ? bullets : base.bullets,
  };
}

export function mergeContact(raw: unknown): ContactContent {
  const base = DEFAULT_SITE_CONTENT.contact;
  if (!isRecord(raw)) return base;
  return {
    sectionTitle: String(raw.sectionTitle ?? base.sectionTitle),
    sectionSubtitle: String(raw.sectionSubtitle ?? base.sectionSubtitle),
    email: String(raw.email ?? base.email),
    whatsapp: String(raw.whatsapp ?? base.whatsapp).replace(/\D/g, ""),
    phone1: String(raw.phone1 ?? base.phone1),
    phone2: String(raw.phone2 ?? base.phone2),
    facebookPageId: String(raw.facebookPageId ?? base.facebookPageId),
    address: String(raw.address ?? base.address),
    mapQuery: String(raw.mapQuery ?? base.mapQuery),
  };
}
