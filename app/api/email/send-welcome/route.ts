export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { welcomeEmailTemplate } from "../template/welcome";

const nodemailer = require("nodemailer");

export async function POST() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "there";

  const { data: profile } = await supabase
    .from("profiles")
    .select("welcome_email_sent")
    .eq("id", user.id)
    .single();

  if (profile?.welcome_email_sent) {
    return NextResponse.json({ skipped: true });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 587,
    secure: false,
    auth: {
      user: "noreply@localtools.app",
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"LocalTools" <noreply@localtools.app>`,
    to: user.email,
    subject: `Welcome to LocalTools, ${name}! 🎉`,
    html: welcomeEmailTemplate(name),
  });

  await supabase
    .from("profiles")
    .update({ welcome_email_sent: true })
    .eq("id", user.id);

  return NextResponse.json({ sent: true });
}
