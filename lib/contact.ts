/** Coordonnées contact — fallbacks (le site lit surtout Supabase) */

export const CONTACT_EMAIL = "okedomi@gmail.com";

/** WhatsApp — chiffres internationaux sans + */
export const WHATSAPP_NUMBER = "24162712263";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Bonjour ALLIANCE M.O BTP, je souhaite des informations sur vos services.";

/** Ouvre WhatsApp (app d’abord, puis api.whatsapp.com) */
export function whatsappUrl(message = WHATSAPP_DEFAULT_MESSAGE) {
  const params = new URLSearchParams({
    phone: WHATSAPP_NUMBER,
    text: message,
  });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

export const FACEBOOK_PAGE_ID = "OKEDOMI";

export function facebookMessengerUrl() {
  return `https://www.facebook.com/messages/t/${FACEBOOK_PAGE_ID}`;
}
