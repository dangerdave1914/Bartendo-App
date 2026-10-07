import type { OrderLine, PacingRules } from "./types";

export type PacingResult =
  | { ok: true }
  | { ok: false; code: "UNDER_21"; message: string }
  | { ok: false; code: "TOO_MANY_IN_ORDER"; message: string; max: number }
  | { ok: false; code: "TOO_SOON"; message: string; retryAt: Date };

export const alcoholicCount = (lines: OrderLine[]): number =>
  lines.reduce((n, l) => n + (l.item.alcoholic ? l.qty : 0), 0);

/**
 * Checks an order against the venue's pacing rules.
 * Non-alcoholic drinks are never limited. The venue sets the rules to match its
 * license and state ABC requirements; this function only enforces what it's given.
 */
export function checkPacing(args: {
  lines: OrderLine[];
  patronIsOfAge: boolean;
  lastAlcoholicOrderAt: Date | null;
  now: Date;
  rules: PacingRules;
}): PacingResult {
  const { lines, patronIsOfAge, lastAlcoholicOrderAt, now, rules } = args;
  const alc = alcoholicCount(lines);
  if (alc === 0) return { ok: true };

  if (!patronIsOfAge) {
    return { ok: false, code: "UNDER_21", message: "This ID is under 21. Remove alcoholic drinks to continue." };
  }
  if (alc > rules.maxAlcoholicPerOrder) {
    return {
      ok: false,
      code: "TOO_MANY_IN_ORDER",
      max: rules.maxAlcoholicPerOrder,
      message: `Up to ${rules.maxAlcoholicPerOrder} alcoholic drinks per order here.`,
    };
  }
  if (lastAlcoholicOrderAt && rules.minMinutesBetweenAlcoholicOrders > 0) {
    const retryAt = new Date(lastAlcoholicOrderAt.getTime() + rules.minMinutesBetweenAlcoholicOrders * 60_000);
    if (now < retryAt) {
      return {
        ok: false,
        code: "TOO_SOON",
        retryAt,
        message: "Your next alcoholic order isn't open yet. Non-alcoholic drinks can go through now.",
      };
    }
  }
  return { ok: true };
}
