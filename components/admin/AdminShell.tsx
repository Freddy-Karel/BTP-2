"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  ExternalLink,
  FileText,
  Hammer,
  Image,
  Menu,
  Phone,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { logoutAdmin } from "@/app/gestion-alliance/actions";

const ICONS = {
  "/gestion-alliance": BarChart3,
  "/gestion-alliance/contenu": FileText,
  "/gestion-alliance/medias": Image,
  "/gestion-alliance/images-provisoires": Image,
  "/gestion-alliance/activites": Hammer,
  "/gestion-alliance/hse": ShieldCheck,
  "/gestion-alliance/moyens": Wrench,
  "/gestion-alliance/realisations": Briefcase,
  "/gestion-alliance/clients": Users,
  "/gestion-alliance/contact": Phone,
  "/gestion-alliance/parametres": Settings,
} as const;

type Props = {
  email: string;
  children: React.ReactNode;
};

export default function AdminShell({ email, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {ADMIN_NAV.map((item) => {
        const Icon = ICONS[item.href];
        const active =
          item.href === "/gestion-alliance"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-start gap-3 rounded-2xl px-3.5 py-3 transition ${
              active
                ? "bg-navy text-white shadow-lg shadow-navy/15"
                : "text-navy/80 hover:bg-navy/5 hover:text-navy"
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                active
                  ? "bg-white/12 text-white"
                  : "bg-white text-navy shadow-sm group-hover:bg-green-soft group-hover:text-green"
              }`}
            >
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {item.label}
              </span>
              <span
                className={`block truncate text-caption ${
                  active ? "text-white/68" : "text-muted"
                }`}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const FooterActions = (
    <div className="shrink-0 space-y-2 border-t border-mist bg-white/95 p-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-center gap-2 rounded-2xl bg-green px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-dark"
      >
        <ExternalLink size={16} />
        Voir le site
      </Link>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="w-full rounded-2xl border border-mist bg-white px-3 py-3 text-sm font-semibold text-navy transition hover:bg-navy/5"
        >
          Déconnexion
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#eef3f8]">
      <aside className="sticky top-0 hidden h-dvh w-80 shrink-0 flex-col border-r border-mist bg-white/96 shadow-[18px_0_50px_rgba(11,67,114,0.06)] lg:flex">
        <div className="shrink-0 border-b border-mist bg-gradient-to-br from-white to-sand/70 px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo variant="mark" height={44} />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-navy">
                ALLIANCE Admin
              </p>
              <p className="truncate text-caption text-muted">{email}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-green/15 bg-green-soft/70 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
              Console locale
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">
              Gestion du site public
            </p>
          </div>
        </div>
        {Nav}
        {FooterActions}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-mist bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <Logo variant="mark" height={32} />
            <span className="font-display text-sm font-semibold text-navy">
              Admin
            </span>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-navy"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {open ? (
          <div className="border-b border-mist bg-white lg:hidden">
            <div className="max-h-[70vh] overflow-y-auto">{Nav}</div>
            {FooterActions}
          </div>
        ) : null}

        <main className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,134,43,0.10),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(238,243,248,0.92))]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,67,114,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(11,67,114,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative mx-auto w-full max-w-[112rem] px-4 py-6 md:px-8 md:py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
