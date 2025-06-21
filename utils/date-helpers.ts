/**
 * Safely converts a date value to a Date object
 * @param dateValue - Can be a Date object, string, or number
 * @returns Date object or null if invalid
 */
export function safeDate(dateValue: any): Date | null {
  if (!dateValue) return null

  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue
  }

  const date = new Date(dateValue)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Safely formats a date to locale string
 * @param dateValue - Can be a Date object, string, or number
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or fallback
 */
export function safeDateFormat(
  dateValue: any,
  options?: Intl.DateTimeFormatOptions,
  fallback = "Invalid Date",
): string {
  const date = safeDate(dateValue)
  if (!date) return fallback

  try {
    return date.toLocaleDateString(undefined, options)
  } catch (error) {
    console.warn("Date formatting error:", error)
    return fallback
  }
}

/**
 * Safely formats a date to relative time (e.g., "2 days ago")
 * @param dateValue - Can be a Date object, string, or number
 * @returns Relative time string or fallback
 */
export function safeRelativeTime(dateValue: any, fallback = "Unknown"): string {
  const date = safeDate(dateValue)
  if (!date) return fallback

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}
