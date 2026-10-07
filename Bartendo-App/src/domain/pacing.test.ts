import { describe, expect, it } from "vitest";
import { checkPacing } from "./pacing";
import type { MenuItem } from "./types";

const beer: MenuItem = { id: "beer", name: "Lager", priceCents: 600, alcoholic: true };
const soda: MenuItem = { id: "soda", name: "Root beer", priceCents: 300, alcoholic: false };
const rules = { minMinutesBetweenAlcoholicOrders: 30, maxAlcoholicPerOrder: 2 };
const now = new Date("2026-10-06T22:00:00Z");

describe("checkPacing", () => {
  it("never limits non-alcoholic orders", () => {
    const r = checkPacing({ lines: [{ item: soda, qty: 5 }], patronIsOfAge: false, lastAlcoholicOrderAt: now, now, rules });
    expect(r.ok).toBe(true);
  });
  it("blocks alcohol for under-21", () => {
    const r = checkPacing({ lines: [{ item: beer, qty: 1 }], patronIsOfAge: false, lastAlcoholicOrderAt: null, now, rules });
    expect(r).toMatchObject({ ok: false, code: "UNDER_21" });
  });
  it("caps alcoholic drinks per order", () => {
    const r = checkPacing({ lines: [{ item: beer, qty: 3 }], patronIsOfAge: true, lastAlcoholicOrderAt: null, now, rules });
    expect(r).toMatchObject({ ok: false, code: "TOO_MANY_IN_ORDER", max: 2 });
  });
  it("enforces the time window and reports when it opens", () => {
    const last = new Date(now.getTime() - 10 * 60_000);
    const r = checkPacing({ lines: [{ item: beer, qty: 1 }], patronIsOfAge: true, lastAlcoholicOrderAt: last, now, rules });
    expect(r).toMatchObject({ ok: false, code: "TOO_SOON" });
    if (!r.ok && r.code === "TOO_SOON") expect(r.retryAt.getTime()).toBe(last.getTime() + 30 * 60_000);
  });
  it("allows once the window has passed", () => {
    const last = new Date(now.getTime() - 31 * 60_000);
    const r = checkPacing({ lines: [{ item: beer, qty: 2 }], patronIsOfAge: true, lastAlcoholicOrderAt: last, now, rules });
    expect(r.ok).toBe(true);
  });
});
