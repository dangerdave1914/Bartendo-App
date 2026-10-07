import type { Cents } from "./money";

export type FeeModel = "PATRON_PER_DRINK" | "VENUE_MONTHLY_CAP";

/**
 * How the venue distributes tips. Bartendo records who the patron designated either way;
 * the venue's policy decides what payroll does with it.
 */
export type TipPolicy = "DESIGNATED_DIRECT" | "POOLED";

export interface PacingRules {
  /** Minimum minutes between alcoholic orders for one patron. 0 = no limit. */
  minMinutesBetweenAlcoholicOrders: number;
  /** Max alcoholic drinks in a single order. */
  maxAlcoholicPerOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  priceCents: Cents;
  alcoholic: boolean;
}

export interface OrderLine {
  item: MenuItem;
  qty: number;
}

export type OrderStatus = "NEW" | "MAKING" | "READY" | "PICKED_UP" | "VOIDED";

/** Who the patron wants the tip to go to. */
export type TipDesignation =
  | { kind: "MAKER" } // whoever makes the drink
  | { kind: "STAFF"; staffId: string }; // a specific bartender the patron picked (their regular)
