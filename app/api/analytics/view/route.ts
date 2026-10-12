import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      path?: string;
      referrer?: string;
    };

    const path = (body.path ?? "").trim().slice(0, 500);
    if (!path || path.startsWith("/gestion-alliance")) {
      return NextResponse.json({ ok: true });
    }

    const referrer = (body.referrer ?? "").slice(0, 500) || null;
    const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 400) || null;

    if (hasDatabaseUrl()) {
      await query(
        `insert into page_views (path, referrer, user_agent)
         values ($1, $2, $3)`,
        [path, referrer, userAgent],
      );
    } else {
      const supabase = await createClient();
      await supabase.from("page_views").insert({
        path,
        referrer,
        user_agent: userAgent,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
