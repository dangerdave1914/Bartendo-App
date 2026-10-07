import type { Cents } from "./money";
import type { OrderStatus, TipDesignation } from "./types";

/**
 * Tip rules (see docs/TIPS.md):
 * 1. The tip is charged with the order and settles to the VENUE, never to a bartender directly.
 *    Bartendo does not pay staff and does not hold tip money.
 * 2. Bartendo records who earned each tip: the bartender the patron designated, or whoever made it.
 * 3. The venue's payroll pays tips out, using the tip report (or Toast, when connected).
 */

export interface TipLedgerEntry {
  orderId: string;
  orderNumber: number;
  status: OrderStatus;
  tipCents: Cents;
  designation: TipDesignation;
  makerStaffId: string | null;
  pickedUpAt: Date | null;
}

/** Who earned this tip. Null means not attributable yet (order not made yet). */
export function tipRecipient(entry: Pick<TipLedgerEntry, "designation" | "makerStaffId">): string | null {
  return entry.designation.kind === "STAFF" ? entry.designation.staffId : entry.makerStaffId;
}

export interface TipReportRow {
  staffId: string;
  designatedCents: Cents; // patron picked this bartender by name
  makerCents: Cents; // patron chose "whoever makes it" and this bartender made it
  totalCents: Cents;
  orderCount: number;
}

export interface TipReport {
  periodStart: Date;
  periodEnd: Date;
  rows: TipReportRow[];
  /** Picked-up orders whose tip couldn't be attributed (should be zero; flag for a manager). */
  unattributedCents: Cents;
  totalCents: Cents;
}

/**
 * Builds the payroll tip report for a period.
 * Only picked-up orders count. Voided orders and orders still in progress are excluded.
 */
export function buildTipReport(entries: TipLedgerEntry[], periodStart: Date, periodEnd: Date): TipReport {
  const rows = new Map<string, TipReportRow>();
  let unattributedCents = 0;
  let totalCents = 0;

  for (const e of entries) {
    if (e.status !== "PICKED_UP" || !e.pickedUpAt) continue;
    if (e.pickedUpAt < periodStart || e.pickedUpAt >= periodEnd) continue;
    if (e.tipCents <= 0) continue;

    totalCents += e.tipCents;
    const staffId = tipRecipient(e);
    if (!staffId) {
      unattributedCents += e.tipCents;
      continue;
    }
    const row = rows.get(staffId) ?? { staffId, designatedCents: 0, makerCents: 0, totalCents: 0, orderCount: 0 };
    if (e.designation.kind === "STAFF") row.designatedCents += e.tipCents;
    else row.makerCents += e.tipCents;
    row.totalCents += e.tipCents;
    row.orderCount += 1;
    rows.set(staffId, row);
  }

  return {
    periodStart,
    periodEnd,
    rows: [...rows.values()].sort((a, b) => b.totalCents - a.totalCents),
    unattributedCents,
    totalCents,
  };
}

/** CSV for payroll import. Names are resolved by the caller. */
export function tipReportToCsv(report: TipReport, staffName: (id: string) => string): string {
  const d = (c: Cents) => (c / 100).toFixed(2);
  const lines = ["staff_id,staff_name,designated_tips,maker_tips,total_tips,orders"];
  for (const r of report.rows) {
    const name = `"${staffName(r.staffId).replace(/"/g, '""')}"`;
    lines.push([r.staffId, name, d(r.designatedCents), d(r.makerCents), d(r.totalCents), r.orderCount].join(","));
  }
  if (report.unattributedCents > 0) lines.push(`UNATTRIBUTED,"Needs manager review",,,${d(report.unattributedCents)},`);
  return lines.join("\n") + "\n";
}
