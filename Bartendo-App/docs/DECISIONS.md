# Decision log

Each entry is a decision we've made. When something changes, add a new entry that supersedes the old one and mark the old one `Superseded by #N`. Don't delete history.

Template:

```
## N. Title
Date: YYYY-MM-DD · Status: Accepted | Superseded by #M | Proposed
Source: who/what drove it (e.g. "beta venue feedback", "ABC answer")
Decision: one or two sentences.
Why: the reasoning.
```

---

## 1. Web app, not app-store apps
Date: 2026-10-06 · Status: Accepted · Source: David
Decision: Bartendo is a web app patrons open from a link or QR code. No iOS/Android store apps for now.
Why: No app store review, instant updates during the beta, works on any phone.

## 2. Tips settle to the venue and flow through the venue's payroll
Date: 2026-10-06 · Status: Accepted · Source: David
Decision: The patron's tip is charged with the order and paid to the venue. Bartendo never pays bartenders directly. Bartendo records who earned each tip and produces a tip report for payroll. When the venue uses Toast, the tip is also attached to the bartender's Toast employee record so it shows up in Toast's own tip reporting. Details in `TIPS.md`.
Why: Tips must go through the employer's payroll to be taxed and reported correctly. Paying staff directly would make Bartendo act like an employer or a money transmitter.

## 3. Patrons can designate a tip to a specific bartender
Date: 2026-10-06 · Status: Accepted · Source: David
Decision: At checkout the patron picks "whoever makes it" or a bartender on shift by name. A designated tip goes to that bartender even if someone else makes the drink.
Why: Keeps the regular-to-bartender relationship that remote ordering would otherwise erase.

## 4. Toast first, behind a POS adapter
Date: 2026-10-06 · Status: Accepted · Source: David (beta venues mostly use Toast)
Decision: Orders get pushed into the venue's POS through a `PosAdapter` interface. Toast is the first adapter. Venues without a connection run in standalone mode.
Why: Venues need app orders in their existing system for sales, tax, inventory and tips. The adapter keeps other POS systems a one-file addition.

## 5. Payments through Stripe Connect
Date: 2026-10-06 · Status: Accepted · Source: compliance review
Decision: Each venue gets a Stripe connected account. Bartendo's platform fee comes off the top.
Why: Bartendo never touches card numbers or holds venue money.

## 6. Minimal ID data
Date: 2026-10-06 · Status: Accepted · Source: compliance review
Decision: Store first name, last initial, last 4 of ID, expiration, date of birth and an of-age flag. No license images, no full ID number, no address.
Why: Less stored data means less breach liability.

## 7. Fake-ID detection and face match deferred
Date: 2026-10-06 · Status: Accepted · Source: David
Decision: The door's card reader handles ID authenticity. A later phase may add a selfie-to-license face match to stop phone handoffs to underage friends.
Why: Hardware at the door already solves authenticity; biometrics bring extra privacy law.

## 8. Per-venue theming on the patron side only
Date: 2026-10-06 · Status: Accepted · Source: David
Decision: Each venue gets a patron-facing theme (colors, fonts, signature touch). Bartender and admin screens stay the same everywhere. Custom layouts are a paid premium.
Why: Brand fit for venues without a per-venue design cost; staff tools stay predictable.
