"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Menu, Phone, X } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { scrollToSection, NAV_OFFSET } from "@/lib/navigation";

const navItems = [
  { name: "Accueil", href: "#accueil" },
  { name: "À propos", href: "#apropos" },
  { name: "Activités", href: "#activites" },
  { name: "Moyens", href: "#moyens" },
  { name: "Réalisations", href: "#realisations" },
  { name: "Contact", href: "#contact" },
];

/** Sections à fond navy : header reste en mode sombre */
const DARK_SECTION_IDS = ["accueil", "realisations"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [active, setActive] = useState("#accueil");
  const [progress, setProgress] = useState(0);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navigatingRef = useRef(false);
  const navigateUnlockTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const updatePill = useCallback(() => {
    if (pathname !== "/") {
      setPill((p) => ({ ...p, ready: false }));
      return;
    }
    const link = linkRefs.current[active];
    const nav = navRef.current;
    if (!link || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setPill({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      ready: true,
    });
  }, [active, pathname]);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(updatePill);
    return () => window.cancelAnimationFrame(frame);
  }, [updatePill, scrolled, open, overDark]);

  useEffect(() => {
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  useEffect(() => {
    const probeDark = () => {
      const probeY = 56;

      // Catalogue : sombre tant que le hero (ou la zone sombre) est sous l’entête
      if (pathname === "/realisations") {
        const hero = document.getElementById("catalogue-hero");
        if (hero) {
          const r = hero.getBoundingClientRect();
          return r.bottom > probeY + 48;
        }
        return window.scrollY < 420;
      }

      if (pathname !== "/") return false;

      for (const id of DARK_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < probeY + 8 && r.bottom > probeY + 8) return true;
      }
      return false;
    };

    const onScrollChrome = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setOverDark(probeDark());
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };

    if (pathname !== "/") {
      onScrollChrome();
      window.addEventListener("scroll", onScrollChrome, { passive: true });
      window.addEventListener("resize", onScrollChrome, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScrollChrome);
        window.removeEventListener("resize", onScrollChrome);
      };
    }

    const onScroll = () => {
      onScrollChrome();
      if (navigatingRef.current) return;
      let current = "#accueil";
      for (const item of navItems) {
        const el = document.getElementById(item.href.slice(1));
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_OFFSET + 24) {
          current = item.href;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScrollChrome, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScrollChrome);
    };
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (navigateUnlockTimer.current) {
        window.clearTimeout(navigateUnlockTimer.current);
      }
    };
  }, []);

  const go = (href: string) => {
    const wasOpen = open;
    setOpen(false);
    // Ancre immédiatement le chrome pour éviter le décalage du clic
    // (padding flottant → collé) pendant le scroll.
    if (href !== "#accueil") {
      setScrolled(true);
    }
    setActive(href);
    navigatingRef.current = true;
    if (navigateUnlockTimer.current) {
      window.clearTimeout(navigateUnlockTimer.current);
    }
    navigateUnlockTimer.current = window.setTimeout(() => {
      navigatingRef.current = false;
      navigateUnlockTimer.current = null;
    }, 900);

    const run = () => {
      if (pathname !== "/") {
        router.push(`/${href}`);
        return;
      }
      scrollToSection(href);
    };

    if (wasOpen) {
      window.setTimeout(run, 60);
    } else {
      run();
    }
  };

  // Menu ouvert → chrome clair (lisibilité du panneau). Sinon sombre sur navy.
  const darkChrome = !open && overDark;
  const attached = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        attached ? "px-0 pt-0" : "px-2.5 pt-2.5 md:px-4 md:pt-3"
      }`}
    >
      <div
        className={`relative mx-auto flex flex-col overflow-hidden ${
          attached
            ? "max-w-none rounded-none"
            : "max-w-7xl rounded-xl md:rounded-2xl"
        } ${darkChrome ? "glass-nav-hero" : "glass-nav"}`}
      >
        <div className="relative flex h-16 items-center justify-between gap-3 px-3 sm:px-4 md:h-[4.5rem] md:px-6">
          <a
            href="#accueil"
            onClick={(e) => {
              e.preventDefault();
              go("#accueil");
            }}
            className="relative z-10 inline-flex shrink-0 items-center hover:opacity-90"
            aria-label="ALLIANCE M.O BTP — Accueil"
          >
            {/* Mobile : pictogramme — crossfade clair/sombre */}
            <span
              className="relative block sm:hidden"
              style={{ width: 48, height: 48 }}
            >
              <Logo
                variant="mark-light"
                height={48}
                priority
                className={`absolute left-0 top-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  darkChrome ? "opacity-100" : "opacity-0"
                }`}
              />
              <Logo
                variant="mark"
                height={48}
                priority
                className={`absolute left-0 top-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  darkChrome ? "opacity-0" : "opacity-100"
                }`}
              />
            </span>
            {/* Desktop : logo complet — crossfade clair/sombre */}
            <span
              className="relative hidden sm:block"
              style={{ width: Math.round(58 * (817 / 358)), height: 58 }}
            >
              <Logo
                variant="full-light"
                height={58}
                priority
                className={`absolute left-0 top-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  darkChrome ? "opacity-100" : "opacity-0"
                }`}
              />
              <Logo
                variant="full"
                height={58}
                priority
                className={`absolute left-0 top-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  darkChrome ? "opacity-0" : "opacity-100"
                }`}
              />
            </span>
          </a>

          <nav
            ref={navRef}
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-0.5 lg:flex ${
              darkChrome ? "glass-chip" : "glass-chip-light"
            }`}
            aria-label="Navigation principale"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute top-0.5 bottom-0.5 z-0 rounded-full transition-[left,width,background-color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                darkChrome ? "bg-white/25" : "bg-navy shadow-sm shadow-navy/20"
              } ${pill.ready ? "opacity-100" : "opacity-0"}`}
              style={{ left: pill.left, width: pill.width }}
            />

            {navItems.map((item) => {
              const isActive = pathname === "/" && active === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  ref={(el) => {
                    linkRefs.current[item.href] = el;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go(item.href);
                  }}
                  data-active={isActive}
                  className={`nav-link relative z-10 touch-manipulation rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 xl:px-3.5 ${
                    isActive
                      ? "text-white"
                      : darkChrome
                        ? "text-white/80 hover:text-white"
                        : "text-navy/75 hover:text-navy"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Link
                href="/gestion-alliance"
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  darkChrome
                    ? "bg-green text-white hover:bg-green-bright"
                    : "bg-navy text-white hover:bg-navy-mid"
                }`}
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Administration</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            ) : null}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
              className="btn-primary hidden !px-4 !py-2 text-sm md:inline-flex"
            >
              <Phone size={15} />
              Devis
            </a>

            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition lg:hidden ${
                darkChrome
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-navy/8 text-navy hover:bg-navy/12"
              }`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-black/5 px-3 pb-3 pt-1 lg:hidden">
            <nav className="flex flex-col gap-1 rounded-xl bg-white p-2 shadow-rest">
              {navItems.map((item) => {
                const isActive = pathname === "/" && active === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-green text-white"
                        : "text-navy hover:bg-navy/5"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
              {isAdmin ? (
                <Link
                  href="/gestion-alliance"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white"
                >
                  <LayoutDashboard size={16} />
                  Interface administrateur
                </Link>
              ) : null}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("#contact");
                }}
                className="btn-primary mt-1 w-full !py-3 text-sm"
              >
                Demander un devis
              </a>
            </nav>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
          aria-hidden
        >
          <div
            className="h-full origin-left bg-green transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}
