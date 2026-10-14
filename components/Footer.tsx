"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import {
  facebookMessengerUrlFrom,
  phoneTelHref,
} from "@/lib/site-content";
import { scrollToSection } from "@/lib/navigation";
import Logo from "@/components/Logo";
import WhatsAppLink from "@/components/WhatsAppLink";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#apropos" },
  { label: "Activités", href: "#activites" },
  { label: "Moyens", href: "#moyens" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Contact", href: "#contact" },
];

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { contact } = useSiteContent();

  const go = (href: string) => {
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    scrollToSection(href);
  };

  return (
    <footer className="relative border-t border-white/10 bg-navy text-white">
      <div className="plan-on-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Marque + mentions légales */}
          <div className="min-w-0 max-w-md">
            <Link
              href="/#accueil"
              onClick={(e) => {
                e.preventDefault();
                go("#accueil");
              }}
              className="inline-flex transition hover:opacity-90"
              aria-label="ALLIANCE M.O BTP — Accueil"
            >
              <Logo variant="full-light" height={32} className="block" />
            </Link>
            <p className="mt-2.5 text-[12px] leading-relaxed text-white/50">
              SARL · Libreville, Gabon
              <span className="mx-1.5 text-white/20">·</span>
              NIF 2024 0100 1098 N
              <span className="mx-1.5 text-white/20">·</span>
              RCCM GA-LBV-01-2024-B13-00042
            </p>
            <p className="mt-1 text-[12px] text-white/40">{contact.address}</p>
          </div>

          {/* Coordonnées + réseaux */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:shrink-0">
            <div className="space-y-1 text-[13px]">
              <p>
                <a
                  href={phoneTelHref(contact.phone1)}
                  className="text-white/75 transition hover:text-white"
                >
                  {contact.phone1}
                </a>
                <span className="mx-1.5 text-white/25">·</span>
                <a
                  href={phoneTelHref(contact.phone2)}
                  className="text-white/75 transition hover:text-white"
                >
                  {contact.phone2}
                </a>
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="block text-white/60 transition hover:text-white"
              >
                {contact.email}
              </a>
            </div>
            <div className="flex gap-1.5">
              <WhatsAppLink
                phone={contact.whatsapp}
                className="inline-flex h-8 w-8 items-center justify-center border border-white/12 text-white/60 transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle size={14} />
              </WhatsAppLink>
              <a
                href={facebookMessengerUrlFrom(contact.facebookPageId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center border border-white/12 text-white/60 transition hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                aria-label="Facebook Messenger"
              >
                <FacebookIcon size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5"
            aria-label="Pied de page"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="text-[12px] text-white/45 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-[11px] tracking-wide text-white/30">
            © {new Date().getFullYear()} ALLIANCE M.O BTP
          </p>
        </div>
      </div>
    </footer>
  );
}
