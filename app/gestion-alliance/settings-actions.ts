"use server";

import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl } from "@/lib/db/postgres";
import {
  getAdminSession,
  updateLocalAdminPassword,
} from "@/lib/auth/local-admin";

export type SettingsState = { ok?: boolean; error?: string };

export async function updateAdminPassword(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    if (!session) return { error: "Non authentifiÃ©." };

    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      return { error: "Mot de passe : 8 caractÃ¨res minimum." };
    }
    if (password !== confirm) {
      return { error: "Les mots de passe ne correspondent pas." };
    }

    await updateLocalAdminPassword(session.email, password);
    return { ok: true };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "Non authentifié." };

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Mot de passe : 8 caractères minimum." };
  }
  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Impossible de changer le mot de passe." };

  return { ok: true };
}
