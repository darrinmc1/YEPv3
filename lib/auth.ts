import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
        ; (session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
}
