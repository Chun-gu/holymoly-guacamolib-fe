export default function formatDate(
  date: string,
  format: 'relative' | 'absolute',
) {
  const started = new Date(date)

  const year = started.getFullYear()
  const month = (started.getMonth() + 1).toString().padStart(2, '0')
  const day = started.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}.${month}.${day}`

  if (format === 'absolute') return formattedDate

  const today = new Date()
  const diff = started.getTime() - today.getTime()
  const absDiff = Math.abs(diff)

  const MINUTE = 60 * 1000
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const MONTH = 30 * DAY

  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' })

  if (absDiff >= MONTH) return formattedDate
  if (absDiff >= DAY) return rtf.format(Math.ceil(diff / DAY), 'day')
  if (absDiff >= HOUR) return rtf.format(Math.ceil(diff / HOUR), 'hour')
  if (absDiff >= MINUTE) return rtf.format(Math.ceil(diff / MINUTE), 'minute')
  return '방금'
}
