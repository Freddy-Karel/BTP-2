"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl } from "@/lib/db/postgres";
import { signInAdmin, signOutAdmin } from "@/lib/auth/local-admin";

export type AuthState = {
  error?: string;
};

export async function loginAdmin(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  if (hasDatabaseUrl()) {
    const ok = await signInAdmin(email, password);
    if (!ok) return { error: "Identifiants incorrects." };
    redirect("/gestion-alliance");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Identifiants incorrects." };
  }

  redirect("/gestion-alliance");
}

export async function logoutAdmin() {
  if (hasDatabaseUrl()) {
    await signOutAdmin();
    redirect("/gestion-alliance/connexion");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/gestion-alliance/connexion");
}
