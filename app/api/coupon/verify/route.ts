import { NextRequest, NextResponse } from "next/server";

type Plan = "3day" | "pro";

/* ---------------- PRICES ---------------- */

const PRICES: Record<Plan, number> = {
  "3day": 199,
  "pro": 499,
};

/* ---------------- COUPONS ---------------- */

const COUPONS: Record<
  string,
  {
    discountPercent: number;
    expiresAt?: string;
    allowedPlans?: Plan[];
  }
> = {
  HARSH10: {
    discountPercent: 10,
  },

  PROONLY20: {
    discountPercent: 20,
    allowedPlans: ["pro"],
  },

  PASS50: {
    discountPercent: 50,
    allowedPlans: ["3day"],
    expiresAt: "2026-01-31",
  },
};

/* ---------------- HELPERS ---------------- */

function normalizePlan(input: unknown): Plan {
  if (typeof input !== "string") return "pro";

  const value = input.trim().toLowerCase();

  if (value === "3day" || value === "3-day" || value === "trial") {
    return "3day";
  }

  return "pro";
}

/* ---------------- API ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const codeRaw = body?.code;
    const planRaw = body?.plan;

    if (!codeRaw) {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const plan = normalizePlan(planRaw);
    const code = String(codeRaw).trim().toUpperCase();

    const coupon = COUPONS[code];

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon code" },
        { status: 200 }
      );
    }

    if (
      coupon.allowedPlans &&
      !coupon.allowedPlans.includes(plan)
    ) {
      return NextResponse.json(
        { valid: false, message: "Coupon not applicable for this plan" },
        { status: 200 }
      );
    }

    if (coupon.expiresAt) {
      const now = new Date();
      const expiry = new Date(coupon.expiresAt);

      if (now > expiry) {
        return NextResponse.json(
          { valid: false, message: "Coupon expired" },
          { status: 200 }
        );
      }
    }

    const originalAmount = PRICES[plan];
    const discountAmount = Math.round(
      (originalAmount * coupon.discountPercent) / 100
    );

    const finalAmount = Math.max(
      originalAmount - discountAmount,
      0
    );

    return NextResponse.json({
      valid: true,
      plan,
      originalAmount,
      discountPercent: coupon.discountPercent,
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    console.error("Coupon verify error:", err);
    return NextResponse.json(
      { valid: false, message: "Server error" },
      { status: 500 }
    );
  }
}
