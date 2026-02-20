import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

const smtpHost = process.env.EMAIL_SERVER_HOST || "smtp.example.com"
const smtpPort = Number(process.env.EMAIL_SERVER_PORT || 587)
const smtpUser = process.env.EMAIL_SERVER_USER
const smtpPass = process.env.EMAIL_SERVER_PASSWORD
const smtpSecure = process.env.EMAIL_SERVER_SECURE === "true"

const smtpAuth =
  smtpUser && smtpPass
    ? { user: smtpUser, pass: smtpPass }
    : undefined

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "PIN Login",
      credentials: {
        email: { label: "Email", type: "email" },
        pin: { label: "4-Digit PIN", type: "password" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, pin, password } = credentials || {}

        // Admin override (hardcoded env)
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        if (
          email === adminEmail &&
          (pin === adminPassword || password === adminPassword)
        ) {
          return {
            id: "admin-user",
            name: "Admin",
            email: adminEmail,
            role: "admin",
          }
        }

        // Regular user — PIN login
        if (!email || !pin) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.pin) return null

        // Simple PIN comparison (PIN is stored as plain string per user request)
        if (user.pin === pin) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "user",
            image: user.image,
          }
        }

        return null
      },
    }),
    EmailProvider({
      server: {
        host: smtpHost,
        port: smtpPort,
        auth: smtpAuth,
        secure: smtpSecure,
      },
      from: process.env.EMAIL_FROM || "login@yourexitplans.com",
      maxAge: 24 * 60 * 60,
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        ; (session.user as { id?: string }).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
}
