export default function shortenNumber(number: number) {
  const formatter = Intl.NumberFormat('kr', { notation: 'compact' })
  return formatter.format(number)
}
