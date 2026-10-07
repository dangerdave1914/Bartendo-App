# Toast integration

## How access works

Venues don't paste a Toast API key into Bartendo. Bartendo has one Toast API client. A venue manager with integration permissions adds Bartendo from Toast's integration marketplace, which grants our client access to that location. We then map the Toast location to the Bartendo venue.

Writing orders requires scopes that Toast's integrations team grants based on business requirements; it's not self-serve. Expected scopes:

| Scope | Why |
| --- | --- |
| `orders.orders:write` | Post Bartendo orders into Toast |
| `orders.items:write` | Add the drinks |
| `orders.payments:write` | Add the payment and the tip |
| `orders.channel:read` | Read back orders we submitted |
| `orders.channel:void` | Void orders we submitted |
| menu and employee read | Map menu items and bartenders to Toast IDs |

## What we push

A paid order, with:
- each drink mapped to the venue's Toast menu item,
- a payment referencing the Stripe charge,
- the tip, attributed to the bartender's Toast employee ID (designated bartender, or the maker once known).

## Steps to get there

1. Apply to Toast's partner program and request sandbox access.
2. Build and test against the Toast sandbox.
3. Confirm with Toast: how a tip is attributed to a specific employee on an API-created order, and whether "whoever makes it" tips can be assigned after the order is created.
4. Pass Toast's integration review.
5. Beta venues add Bartendo from the marketplace.

## Until then

Beta venues run in **standalone mode**: orders live in Bartendo, the venue gets the sales export and the tip report, and the venue's Toast stays the official record for everything else. Bartenders shouldn't have to re-ring app orders long term, so this is a beta-only arrangement.

## Reference
Toast developer docs: https://doc.toasttab.com/
