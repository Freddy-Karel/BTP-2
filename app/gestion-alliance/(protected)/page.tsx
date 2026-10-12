import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Eye,
  Map,
  TrendingUp,
} from "lucide-react";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { getAnalyticsSummary } from "@/lib/analytics";
import { ADMIN_NAV } from "@/lib/admin-nav";

export default async function AdminDashboardPage() {
  const stats = await getAnalyticsSummary();

  const cards = [
    {
      label: "Vues aujourd'hui",
      value: stats.viewsToday,
      icon: Eye,
      hint: "Activité du jour",
    },
    {
      label: "7 derniers jours",
      value: stats.views7d,
      icon: TrendingUp,
      hint: "Tendance hebdomadaire",
    },
    {
      label: "30 derniers jours",
      value: stats.views30d,
      icon: CalendarDays,
      hint: "Volume mensuel",
    },
    {
      label: "Pages distinctes",
      value: stats.uniquePaths30d,
      icon: Map,
      hint: "Sur 30 jours",
    },
  ];

  const modules = ADMIN_NAV.filter((item) => item.href !== "/gestion-alliance");

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-navy shadow-[0_24px_80px_rgba(11,67,114,0.18)]">
        <div className="relative p-7 text-white md:p-9">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,134,43,0.40),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-bright">
                Vue d&apos;ensemble
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
                Tableau de bord
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72">
                Suivez la fréquentation du site public et accédez rapidement aux
                modules essentiels de gestion.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-navy shadow-sm transition hover:bg-green-soft"
            >
              Ouvrir le site
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="rounded-3xl border border-white/70 bg-white/92 p-5 shadow-rest backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{card.label}</p>
                  <p className="mt-2 font-display text-4xl font-bold tabular-nums text-navy">
                    {card.value.toLocaleString("fr-FR")}
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-soft text-green">
                  <Icon size={21} />
                </span>
              </div>
              <p className="mt-4 border-t border-mist pt-3 text-caption font-medium text-muted">
                {card.hint}
              </p>
            </article>
          );
        })}
      </div>

      <AnalyticsCharts data={stats} />

      <section className="rounded-[2rem] border border-white/70 bg-white/86 p-6 shadow-rest backdrop-blur-sm md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">
              Modules
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy">
              Gestion du site
            </h2>
            <p className="mt-1 text-sm text-muted">
              Accès rapide aux contenus, médias, références et paramètres.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-2xl bg-navy/5 px-4 py-2 text-sm font-semibold text-navy">
            <BarChart3 size={16} />
            {modules.length} modules actifs
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-mist bg-white p-5 shadow-sm transition hover:border-green/25 hover:shadow-hover"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-bold text-navy group-hover:text-green">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green transition group-hover:bg-green group-hover:text-white">
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
