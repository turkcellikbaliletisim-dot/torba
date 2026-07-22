export type Currency = 'TRY';

export interface Money {
  amountMinor: bigint;
  currency: Currency;
}

export function money(amountMinor: bigint, currency: Currency = 'TRY'): Money {
  if (amountMinor < 0n) {
    throw new Error('Money amount cannot be negative.');
  }

  return { amountMinor, currency };
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return money(left.amountMinor + right.amountMinor, left.currency);
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);

  if (right.amountMinor > left.amountMinor) {
    throw new Error('Resulting money amount cannot be negative.');
  }

  return money(left.amountMinor - right.amountMinor, left.currency);
}

export function calculateBasisPoints(value: Money, basisPoints: number): Money {
  if (!Number.isInteger(basisPoints) || basisPoints < 0 || basisPoints > 10_000) {
    throw new Error('Basis points must be an integer between 0 and 10000.');
  }

  const result = (value.amountMinor * BigInt(basisPoints)) / 10_000n;
  return money(result, value.currency);
}

function assertSameCurrency(left: Money, right: Money): void {
  if (left.currency !== right.currency) {
    throw new Error('Currency mismatch.');
  }
}
