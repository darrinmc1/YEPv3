"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"

type Status = "idle" | "loading" | "sent" | "error"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<string>("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email) {
      setStatus("error")
      setMessage("Enter the email you want us to send the magic link to.")
      return
    }

    setStatus("loading")
    setMessage("")

    const response = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
    })

    if (response?.ok) {
      setStatus("sent")
      setMessage("Magic link sent. Check your inbox to finish signing in.")
      return
    }

    setStatus("error")
    setMessage(
      response?.error ||
        "We could not send the magic link. Double-check SMTP env vars once you add them."
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[90vh] items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg">
          <Card className="backdrop-blur-xl border border-white/10 bg-black/50 text-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-400" />
                Sign in with email
              </CardTitle>
              <CardDescription className="text-sm text-neutral-300">
                Passwordless login powered by magic links. We will email you a secure link that signs you in.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-200">
                    Work or personal email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="bg-black/60 border-white/15 text-white placeholder:text-neutral-500"
                  />
                  <p className="text-xs text-neutral-400">
                    Email delivery needs SMTP env vars configured (host, user, password, from address).
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-blue-500 text-black font-semibold hover:bg-blue-400 transition-all"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending magic link...
                    </span>
                  ) : (
                    "Send me a magic link"
                  )}
                </Button>
              </form>

              {status !== "idle" && (
                <div className="mt-6">
                  <Alert variant={status === "error" ? "destructive" : "default"} className="border-white/15 bg-white/5">
                    <AlertTitle>{status === "sent" ? "Check your inbox" : "Heads up"}</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>

            <div className="flex items-center justify-between px-6 pb-6 text-sm text-neutral-300">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                ← Back to home
              </Link>
              <span className="text-neutral-500">No password required.</span>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
