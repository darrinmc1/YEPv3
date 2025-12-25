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

// JWT utilities
export interface AdminTokenPayload {
  email: string
  role: 'admin'
  iat?: number
  exp?: number
}

export function generateAdminToken(email: string): string {
  // Simple token generation (REPLACE WITH JWT IN PRODUCTION)
  // TODO: Use jsonwebtoken.sign() in production
  const secret = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me'
  const payload = {
    email,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = createHash('sha256')
    .update(base64Payload + secret)
    .digest('base64')
  
  return `${base64Payload}.${signature}`
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  // Simple token verification (REPLACE WITH JWT IN PRODUCTION)
  // TODO: Use jsonwebtoken.verify() in production
  try {
    const secret = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me'
    const [base64Payload, signature] = token.split('.')
    
    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(base64Payload + secret)
      .digest('base64')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
    
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null
    }
    
    return payload as AdminTokenPayload
  } catch {
    return null
  }
}

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
