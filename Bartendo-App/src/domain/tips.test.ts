import { describe, expect, it } from "vitest";
import { buildTipReport, tipReportToCsv, type TipLedgerEntry } from "./tips";

const start = new Date("2026-10-06T00:00:00Z");
const end = new Date("2026-10-07T00:00:00Z");
const at = new Date("2026-10-06T23:00:00Z");

const entries: TipLedgerEntry[] = [
  // Regular designated Tasha by name; Marcus actually made it. Tasha still gets it.
  { orderId: "a", orderNumber: 101, status: "PICKED_UP", tipCents: 500, designation: { kind: "STAFF", staffId: "tasha" }, makerStaffId: "marcus", pickedUpAt: at },
  // "Whoever makes it" -> Marcus made it.
  { orderId: "b", orderNumber: 102, status: "PICKED_UP", tipCents: 300, designation: { kind: "MAKER" }, makerStaffId: "marcus", pickedUpAt: at },
  // Voided: excluded.
  { orderId: "c", orderNumber: 103, status: "VOIDED", tipCents: 900, designation: { kind: "MAKER" }, makerStaffId: "marcus", pickedUpAt: null },
  // Still being made: excluded until picked up.
  { orderId: "d", orderNumber: 104, status: "MAKING", tipCents: 200, designation: { kind: "MAKER" }, makerStaffId: "tasha", pickedUpAt: null },
  // Outside the period: excluded.
  { orderId: "e", orderNumber: 99, status: "PICKED_UP", tipCents: 400, designation: { kind: "MAKER" }, makerStaffId: "tasha", pickedUpAt: new Date("2026-10-05T23:00:00Z") },
];

describe("buildTipReport", () => {
  const report = buildTipReport(entries, start, end);
  it("credits designated tips to the designated bartender, not the maker", () => {
    expect(report.rows.find((r) => r.staffId === "tasha")).toMatchObject({ designatedCents: 500, makerCents: 0, totalCents: 500 });
  });
  it("credits maker tips to whoever made the drink", () => {
    expect(report.rows.find((r) => r.staffId === "marcus")).toMatchObject({ designatedCents: 0, makerCents: 300, totalCents: 300 });
  });
  it("only counts picked-up orders inside the period", () => {
    expect(report.totalCents).toBe(800);
    expect(report.unattributedCents).toBe(0);
  });
  it("exports CSV for payroll", () => {
    const csv = tipReportToCsv(report, (id) => ({ tasha: "Tasha", marcus: "Marcus" })[id] ?? id);
    expect(csv).toContain('tasha,"Tasha",5.00,0.00,5.00,1');
    expect(csv).toContain('marcus,"Marcus",0.00,3.00,3.00,1');
  });
});
