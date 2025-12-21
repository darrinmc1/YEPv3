import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

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

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "admin-user",
            name: "Admin",
            email: adminEmail,
            role: "admin"
          }
        }

        // You can also add logic here to check against the database for other users if needed
        // but for now we are strictly solving the Admin hardcoded creds issue.

        return null
      }
    }),
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
        ; (session.user as { id?: string }).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
}
