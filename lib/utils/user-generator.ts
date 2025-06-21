/**
 * Generates a username based on school code, year, and sequential number
 * @param schoolCode The school code (e.g., "NPS" for Nairobi Primary School)
 * @param sequentialNumber The sequential number for the student
 * @returns A username in the format {schoolCode}{year}{sequentialNumber}
 */
export function generateUsername(schoolCode: string, sequentialNumber: number): string {
  const year = new Date().getFullYear()
  const paddedNumber = sequentialNumber.toString().padStart(3, "0")
  return `${schoolCode}${year}${paddedNumber}`
}

/**
 * Generates a random password with specified length
 * @param length The length of the password (default: 8)
 * @returns A random password with mixed characters
 */
export function generatePassword(length = 8): string {
  const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lowerChars = "abcdefghijkmnopqrstuvwxyz"
  const numbers = "23456789"

  let password = ""

  // Ensure at least one uppercase letter
  password += upperChars.charAt(Math.floor(Math.random() * upperChars.length))

  // Ensure at least one lowercase letter
  password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length))

  // Ensure at least one number
  password += numbers.charAt(Math.floor(Math.random() * numbers.length))

  // Fill the rest with random characters
  const allChars = upperChars + lowerChars + numbers
  for (let i = 3; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

/**
 * Generates an email address based on username and domain
 * @param username The username
 * @param domain The email domain (default: "cbctutorbot.edu")
 * @returns An email address in the format {username}@{domain}
 */
export function generateEmail(username: string, domain = "cbctutorbot.edu"): string {
  return `${username}@${domain}`
}
