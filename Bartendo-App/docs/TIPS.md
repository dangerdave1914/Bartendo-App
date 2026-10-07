# How tips work

## The rule

Tip money goes **patron → venue → bartender (via payroll)**. Bartendo records and reports; it never pays staff and never holds tip money.

## Flow

1. **Checkout.** Patron picks a tip (percent of the drink subtotal) and who it's for:
   - **Whoever makes it** (default), or
   - **A specific bartender on shift**, by name (their regular).
2. **Payment.** The tip is charged with the order on the venue's Stripe connected account. It's the venue's money from that moment, held for the employee like any card tip.
3. **Attribution.**
   - Designated tip → the named bartender, even if a coworker makes the drink.
   - "Whoever makes it" → the bartender who taps **Start making**.
4. **Counted when picked up.** A tip goes on the report once the order is marked picked up. Voided orders don't count.
5. **Payroll.**
   - **Toast venues:** the order is pushed into Toast with the tip attached to the bartender's Toast employee record, so it appears in Toast's tip reporting and payroll like any other card tip. (Depends on Toast API access; see `TOAST_INTEGRATION.md`.)
   - **Everyone:** Bartendo's tip report, per pay period, per bartender, split into designated and maker tips. Exportable as CSV. Code: `src/domain/tips.ts`.

## Venue tip policy

Venues set `tipPolicy`:
- `DESIGNATED_DIRECT`: payroll pays each bartender what the report shows.
- `POOLED`: the venue pools tips under its own policy. Bartendo still reports who was designated, but the venue's pool decides payout.

Checkout copy must be honest about this. For pooled venues, the patron sees that tips are shared according to the venue's policy, so a regular isn't misled into thinking a designated tip goes only to one person.

## Edge cases (current answers; amend in `DECISIONS.md`)

- **Designated bartender clocks out before the order is made:** tip stays with the designated bartender. *Confirm with venues.*
- **Order voided after the tip was charged:** tip is refunded with the order and drops off the report.
- **No maker recorded on a picked-up "whoever makes it" order:** shows as *unattributed* on the report for a manager to assign. Should never happen if the queue is used.
