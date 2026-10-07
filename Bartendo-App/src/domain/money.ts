/** All money is integer cents. Never use floats for currency. */
export type Cents = number;

export const dollars = (cents: Cents): string => `$${(cents / 100).toFixed(2)}`;

/** Percentage of an amount, rounded to the nearest cent. */
export const percentOf = (amount: Cents, pct: number): Cents => Math.round((amount * pct) / 100);
