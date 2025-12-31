import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Auth users
  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    return NextResponse.json(
      { error: authError.message },
      { status: 500 }
    );
  }

  // Profiles (plan)
  const { data: profiles, error: profileError } =
    await supabase.from("profiles").select("id, plan");

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  const profileMap = new Map(
    profiles.map((p) => [p.id, p.plan])
  );

  const users = authData.users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    plan: profileMap.get(u.id) ?? "free",
  }));

  return NextResponse.json(users);
}
