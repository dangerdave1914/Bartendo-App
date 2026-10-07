import type { Cents } from "@/domain/money";

/**
 * Every point-of-sale integration implements this interface.
 * The rest of Bartendo only talks to PosAdapter, so adding Square, Clover, etc.
 * later means adding one file, not touching the ordering logic.
 */
export interface PosOrderLine {
  posItemId: string; // the venue's menu item ID in their POS
  qty: number;
  unitPriceCents: Cents;
}

export interface PushOrderInput {
  venuePosLocationId: string; // e.g. Toast restaurant GUID
  bartendoOrderId: string;
  orderNumber: number;
  patronDisplayName: string; // "Jordan R." -- never the ID number
  lines: PosOrderLine[];
  subtotalCents: Cents;
  tipCents: Cents;
  /** POS employee ID of the bartender the tip belongs to, so the POS's own tip reporting and payroll pick it up. */
  tipRecipientPosEmployeeId: string | null;
  /** Reference to the payment already captured (e.g. Stripe PaymentIntent ID). */
  externalPaymentRef: string;
}

export interface PushOrderResult {
  posOrderId: string;
}

export interface PosAdapter {
  readonly provider: "standalone" | "toast";
  /** Send a paid Bartendo order into the venue's POS so sales, tax, inventory and tips land where the venue already looks. */
  pushOrder(input: PushOrderInput): Promise<PushOrderResult>;
  /** Attach the bartender who made it, once known (for "whoever makes it" tips). */
  assignTipRecipient(posOrderId: string, posEmployeeId: string): Promise<void>;
  /** Void in the POS when Bartendo voids. */
  voidOrder(posOrderId: string, reason: string): Promise<void>;
}
