import type { PosAdapter } from "./PosAdapter";

/**
 * For venues with no POS connection (and for the beta).
 * Orders live only in Bartendo; the venue uses Bartendo's sales export and tip report.
 */
export const standaloneAdapter: PosAdapter = {
  provider: "standalone",
  async pushOrder(input) {
    return { posOrderId: `bartendo:${input.bartendoOrderId}` };
  },
  async assignTipRecipient() {},
  async voidOrder() {},
};
