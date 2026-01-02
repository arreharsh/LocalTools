export const runtime = "nodejs";
import { reviewEmailTemplate } from "../template/review";
import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
  const { name, role, text, rating } = await req.json();

  if (!text) {
    return NextResponse.json(
      { error: "Missing review text" },
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
    from: `"LocalTools Reviews" <noreply@localtools.app>`,
    to: "admin@localtools.app",
    subject: "⭐ New Review Submitted",
    html: reviewEmailTemplate({
      name,
      role,
      text,
      rating,
    }),
  });

  return NextResponse.json({ success: true });
}
