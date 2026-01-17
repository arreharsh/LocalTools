import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const token = req.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser(token);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { data: authData } =
    await supabase.auth.admin.listUsers();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, plan, pro_expires_at");

  const map = new Map(
    profiles?.map((p) => [p.id, p])
  );

  return NextResponse.json(
    authData.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      plan: map.get(u.id)?.plan ?? "free",
      pro_expires_at: map.get(u.id)?.pro_expires_at ?? null,
    }))
  );
}
