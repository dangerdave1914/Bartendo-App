import type { PosAdapter, PushOrderInput } from "./PosAdapter";

/**
 * Toast integration. NOT FUNCTIONAL YET -- see docs/TOAST_INTEGRATION.md.
 *
 * How access works: Bartendo has ONE Toast API client. A venue manager adds Bartendo from
 * Toast's integration marketplace, which grants our client access to that location.
 * Venues do not paste API keys into Bartendo.
 *
 * Scopes we expect to need (granted by Toast's integrations team, not self-serve):
 *   orders.orders:write    post orders
 *   orders.items:write     add items
 *   orders.payments:write  add payments and tips to orders
 *   orders.channel:read    read back orders we submitted
 *   orders.channel:void    void orders we submitted
 *   (plus menu read and employee read to map items and bartenders)
 */
export function createToastAdapter(_config: { hostname: string; clientId: string; clientSecret: string }): PosAdapter {
  const notYet = (what: string) =>
    new Error(`Toast ${what} not implemented. Requires Toast partner access; see docs/TOAST_INTEGRATION.md.`);
  return {
    provider: "toast",
    async pushOrder(_input: PushOrderInput) {
      // TODO: authenticate, map lines to Toast menu item GUIDs, POST order with an "other" payment
      // referencing the Stripe payment, and set the tip against the bartender's Toast employee GUID.
      throw notYet("pushOrder");
    },
    async assignTipRecipient() {
      throw notYet("assignTipRecipient");
    },
    async voidOrder() {
      throw notYet("voidOrder");
    },
  };
}
