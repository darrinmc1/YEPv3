// Admin authentication utilities
// Note: You'll need to install: npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken

// For now, using crypto for hashing (production should use bcrypt)
import { createHash, randomBytes } from 'crypto'

// Simple hash function (REPLACE WITH BCRYPT IN PRODUCTION)
export function hashPassword(password: string): string {
  // TODO: Replace with bcrypt.hash(password, 10) in production
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  // TODO: Replace with bcrypt.compare(password, hashedPassword) in production
  try {
    const [salt, hash] = hashedPassword.split(':')
    const testHash = createHash('sha256').update(password + salt).digest('hex')
    return hash === testHash
  } catch {
    return false
  }
}

// JWT utilities moved to lib/auth-token.ts to be Edge compatible
import { verifyAdminToken } from './auth-token'
export type { AdminTokenPayload } from './auth-token'
export { verifyAdminToken }

// Verify admin credentials
export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourexitplans.com'
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  // Check email
  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return false
  }

  // In development, allow simple password
  if (process.env.NODE_ENV === 'development' && password === '1234') {
    return true
  }

  // Check password hash
  if (!adminPasswordHash) {
    console.error('ADMIN_PASSWORD_HASH not set in environment variables')
    return false
  }

  return verifyPassword(password, adminPasswordHash)
}

// Generate a password hash for setup
export function generatePasswordHashForSetup(password: string): string {
  return hashPassword(password)
}
