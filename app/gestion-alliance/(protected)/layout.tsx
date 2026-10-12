import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";

export const metadata: Metadata = {
  title: "Administration | ALLIANCE M.O BTP",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    if (!session) redirect("/gestion-alliance/connexion");
    return <AdminShell email={session.email}>{children}</AdminShell>;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/gestion-alliance/connexion");
  }

  const email =
    typeof data.claims.email === "string" ? data.claims.email : "Admin";

  return <AdminShell email={email}>{children}</AdminShell>;
}
