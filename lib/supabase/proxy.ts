import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/env";

const ADMIN_BASE = "/gestion-alliance";
const LOGIN_PATH = `${ADMIN_BASE}/connexion`;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (process.env.DATABASE_URL || !hasSupabaseEnv()) {
    return supabaseResponse;
  }

  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const path = request.nextUrl.pathname;
  const isAdmin = path === ADMIN_BASE || path.startsWith(`${ADMIN_BASE}/`);
  const isLogin = path === LOGIN_PATH || path.startsWith(`${LOGIN_PATH}/`);

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_BASE;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
