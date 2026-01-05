export function formatCurrency(amount: number): string {
  return `PKR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `PKR ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `PKR ${(amount / 1000).toFixed(1)}K`;
  }
  return `PKR ${amount}`;
}
