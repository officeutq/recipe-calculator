function formatAmount(value: number): string {
  const roundedValue = Math.round(value * 100) / 100
  return roundedValue.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")
}

export default formatAmount
