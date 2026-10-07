import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPacing } from "@/domain/pacing";
import { percentOf } from "@/domain/money";
import type { MenuItem } from "@/domain/types";

const Body = z.object({
  venueSlug: z.string(),
  checkinId: z.string(),
  lines: z.array(z.object({ menuItemId: z.string(), qty: z.number().int().min(1).max(10) })).min(1),
  tipPercent: z.number().min(0).max(100),
  tip: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("MAKER") }),
    z.object({ kind: z.literal("STAFF"), staffId: z.string() }),
  ]),
});

/**
 * Create an order. Server is the source of truth: prices, pacing and fees are recomputed here,
 * never trusted from the phone.
 * TODO: load venue/menu/checkin from the database, create Stripe PaymentIntent on the venue's
 * connected account, persist the order, then push to the venue's POS adapter.
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;

  // Placeholder data until the database is wired up.
  const menu: Record<string, MenuItem> = {
    pal: { id: "pal", name: "Paloma", priceCents: 1100, alcoholic: true },
    agu: { id: "agu", name: "Agua de Jamaica", priceCents: 500, alcoholic: false },
  };
  const venue = { paceMinutes: 30, maxAlcoholicPerOrder: 2, feeModel: "PATRON_PER_DRINK" as const };
  const checkin = { verifiedOfAge: true, lastAlcoholicOrderAt: null as Date | null };

  const lines = body.lines.map((l) => {
    const item = menu[l.menuItemId];
    if (!item) throw new Error(`Unknown menu item ${l.menuItemId}`);
    return { item, qty: l.qty };
  });

  const pacing = checkPacing({
    lines,
    patronIsOfAge: checkin.verifiedOfAge,
    lastAlcoholicOrderAt: checkin.lastAlcoholicOrderAt,
    now: new Date(),
    rules: { minMinutesBetweenAlcoholicOrders: venue.paceMinutes, maxAlcoholicPerOrder: venue.maxAlcoholicPerOrder },
  });
  if (!pacing.ok) return NextResponse.json({ error: pacing }, { status: 409 });

  const subtotalCents = lines.reduce((s, l) => s + l.item.priceCents * l.qty, 0);
  const drinkCount = lines.reduce((s, l) => s + l.qty, 0);
  const patronFeeCents = venue.feeModel === "PATRON_PER_DRINK" ? drinkCount * 100 : 0;
  const tipCents = percentOf(subtotalCents, body.tipPercent);

  return NextResponse.json({
    subtotalCents,
    patronFeeCents,
    tipCents,
    totalCents: subtotalCents + patronFeeCents + tipCents,
    tip: body.tip,
  });
}
