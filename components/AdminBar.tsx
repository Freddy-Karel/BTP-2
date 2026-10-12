"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

/** Visible uniquement sur le site public quand l’admin est connecté */
export default function AdminBar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/gestion-alliance")) {
      return;
    }
    if (!hasSupabaseEnv()) return;

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [pathname]);

  if (!email || pathname?.startsWith("/gestion-alliance")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 md:p-4">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-2xl border border-white/15 bg-navy/95 px-3 py-2 text-white shadow-modal backdrop-blur-md sm:gap-3 sm:px-4">
        <span className="hidden max-w-[10rem] truncate text-caption text-white/65 sm:inline">
          {email}
        </span>
        <span className="rounded-md bg-green/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Admin
        </span>
        <Link
          href="/gestion-alliance"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          <LayoutDashboard size={16} />
          Tableau de bord
        </Link>
        <Link
          href="/gestion-alliance/contenu"
          className="inline-flex items-center gap-1.5 rounded-xl bg-green px-3 py-2 text-sm font-medium transition hover:bg-green-bright"
        >
          <Pencil size={16} />
          Gérer
        </Link>
      </div>
    </div>
  );
}
