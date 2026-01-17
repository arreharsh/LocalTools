import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Action = "free" | "pro_3day" | "pro_lifetime";

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (!userId || !["free", "pro_3day", "pro_lifetime"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    let update: {
      plan: "free" | "pro";
      pro_expires_at: string | null;
    };

    // 🔥 SINGLE SOURCE OF TRUTH
    if (action === "free") {
      update = {
        plan: "free",
        pro_expires_at: null,
      };
    }

    if (action === "pro_3day") {
      const expires = new Date();
      expires.setDate(expires.getDate() + 3);

      update = {
        plan: "pro",
        pro_expires_at: expires.toISOString(),
      };
    }

    if (action === "pro_lifetime") {
      update = {
        plan: "pro",
        pro_expires_at: "2099-12-31T00:00:00.000Z",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(update!)
      .eq("id", userId)
      .select("id, plan, pro_expires_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
