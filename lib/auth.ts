import { randomUUID } from "crypto"
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters"
import type { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"

function createInMemoryAdapter(): Adapter {
  const users = new Map<string, AdapterUser>()
  const accounts = new Map<string, AdapterAccount>()
  const sessions = new Map<string, AdapterSession>()
  const verificationTokens = new Map<string, VerificationToken>()

  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const id = randomUUID()
      const record: AdapterUser = { ...user, id, emailVerified: user.emailVerified ?? null }
      users.set(id, record)
      return record
    },
    async getUser(id) {
      return users.get(id ?? "") ?? null
    },
    async getUserByEmail(email: string) {
      const lower = email?.toLowerCase()
      for (const user of Array.from(users.values())) {
        if (user.email?.toLowerCase() === lower) return user
      }
      return null
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = accounts.get(`${provider}:${providerAccountId}`)
      if (!account) return null
      return users.get(account.userId) ?? null
    },
    async updateUser(user) {
      const existing = user.id ? users.get(user.id) : null
      if (!existing) {
        throw new Error("Cannot update user that does not exist in adapter")
      }
      const updated = { ...existing, ...user }
      users.set(updated.id, updated)
      return updated
    },
    async deleteUser(userId: string) {
      if (!userId) return
      users.delete(userId)
      for (const [token, session] of Array.from(sessions.entries())) {
        if (session.userId === userId) sessions.delete(token)
      }
    },
    async linkAccount(account) {
      const key = `${account.provider}:${account.providerAccountId}`
      const stored = { ...account, id: account.id ?? randomUUID() }
      accounts.set(key, stored)
      return stored
    },
    async unlinkAccount({ provider, providerAccountId }) {
      accounts.delete(`${provider}:${providerAccountId}`)
    },
    async createSession(session) {
      sessions.set(session.sessionToken, session)
      return session
    },
    async getSessionAndUser(sessionToken) {
      const session = sessions.get(sessionToken)
      if (!session) return null
      const user = users.get(session.userId)
      if (!user) return null
      return { session, user }
    },
    async updateSession(session) {
      const existing = sessions.get(session.sessionToken)
      if (!existing) return null
      const updated = { ...existing, ...session }
      sessions.set(updated.sessionToken, updated)
      return updated
    },
    async deleteSession(sessionToken) {
      sessions.delete(sessionToken)
    },
    async createVerificationToken(token) {
      const key = `${token.identifier}:${token.token}`
      verificationTokens.set(key, token)
      return token
    },
    async useVerificationToken(token) {
      const key = `${token.identifier}:${token.token}`
      const stored = verificationTokens.get(key)
      if (!stored) return null
      verificationTokens.delete(key)
      return stored
    },
  }
}

const smtpHost = process.env.EMAIL_SERVER_HOST || "smtp.example.com"
const smtpPort = Number(process.env.EMAIL_SERVER_PORT || 587)
const smtpUser = process.env.EMAIL_SERVER_USER
const smtpPass = process.env.EMAIL_SERVER_PASSWORD
const smtpSecure = process.env.EMAIL_SERVER_SECURE === "true"

const smtpAuth =
  smtpUser && smtpPass
    ? {
        user: smtpUser,
        pass: smtpPass,
      }
    : undefined

export const authOptions: NextAuthOptions = {
  adapter: createInMemoryAdapter(),
  session: { strategy: "jwt" },
  providers: [
    EmailProvider({
      server: {
        host: smtpHost,
        port: smtpPort,
        auth: smtpAuth,
        secure: smtpSecure,
      },
      from: process.env.EMAIL_FROM || "login@example.com",
      maxAge: 24 * 60 * 60, // 24 hours
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        ;(session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
}
