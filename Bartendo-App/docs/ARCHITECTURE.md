# Architecture

```
 Door scanner ──► Check-in ──► Patron web app (themed per venue)
                                   │  order + tip + payment
                                   ▼
                              Bartendo API ──► Stripe Connect (venue's account)
                                   │
                ┌──────────────────┼───────────────────┐
                ▼                  ▼                   ▼
        Bartender queue     POS adapter (Toast)   Reports (sales, tips → payroll)
```

## Order lifecycle

`NEW` → `MAKING` (bartender taps Start; becomes maker) → `READY` (seal sticker confirmed) → `PICKED_UP` (name and number matched at handoff). Any state before pickup can go to `VOIDED`.

## Principles

- The server recomputes prices, fees, pacing and tips. Never trust totals from the phone.
- Money is integer cents.
- Domain rules live in `src/domain/` as plain functions with tests. UI and integrations call them; they don't reimplement them.
- Patron UI is themed per venue. Staff and admin UI is not.
