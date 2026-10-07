# Bartendo

Order drinks from your phone, pick them up sealed.

Bartendo is a web app for bars. The door scans a patron's ID and checks them in. From then on they order and pay from their phone, skip the crowd at the bar, and pick up a tamper-sealed drink with their name on the claim ticket. Bartenders work a simple queue. Tips are recorded per bartender and flow to the venue's payroll.

## Status

Early scaffold. The clickable product prototype is in [`prototype/index.html`](prototype/index.html); open it in a browser. The real app is being built out from it.

## What's here

| Path | What it is |
| --- | --- |
| `prototype/` | Single-file clickable prototype: patron, bartender and venue views, three themed demo venues |
| `src/domain/` | Core rules with tests: pacing (ABC limits), tips and the payroll tip report, money |
| `src/integrations/pos/` | Point-of-sale adapters. `standalone` works today; `toast` is stubbed |
| `src/themes/` | Per-venue patron skins |
| `src/app/` | Next.js web app: patron (`/v/[venue]`), bartender (`/bar`), API (`/api/orders`) |
| `prisma/schema.prisma` | Database model |
| `docs/` | How it works and why. **Start with `docs/DECISIONS.md`.** |

## Run it

```bash
npm install
npm test          # domain rules
npm run dev       # http://localhost:3000
```

Database setup (when needed): copy `.env.example` to `.env`, point `DATABASE_URL` at Postgres, then `npm run db:migrate`.

## Stack

Next.js + TypeScript (web app, no app store needed for beta), Postgres via Prisma, Stripe Connect for payments (venues are paid directly; Bartendo never holds funds), POS adapters starting with Toast.

## Changing the plan

Product decisions change as we learn from venues. Every change goes in `docs/DECISIONS.md` as a new entry: what changed, why, and who it came from. Don't edit old entries; supersede them.
