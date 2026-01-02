export const runtime = "nodejs";

import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
import { requestToolEmailTemplate } from "../template/request-tool";

export async function POST(req: Request) {
  const { tool, desc } = await req.json();

  if (!tool) {
    return NextResponse.json(
      { error: "Missing tool name" },
      { status: 400 }
    );
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
    from: `"LocalTools Requests" <noreply@localtools.app>`,
    to: "admin@localtools.app",
    subject: "🛠️ New Tool Request",
    html: requestToolEmailTemplate({
      tool,
      desc,
    }),
  });

  return NextResponse.json({ success: true });
}
