/** Navigation one-page — ancres fiables depuis n'importe quelle route */

export const NAV_OFFSET = 72;

export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.pushState(null, "", `#${id}`);
  return true;
}

/** Depuis une autre page → home + hash */
export function homeHash(hash: string) {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  return `/${id}`;
}
