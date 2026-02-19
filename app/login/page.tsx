"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        pin,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or PIN. Please try again.")
        setIsLoading(false)
        return
      }

      // Successful login
      router.push("/")
      router.refresh()

    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[90vh] items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg">
          <Card className="backdrop-blur-xl border border-white/10 bg-black/50 text-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                Sign In
              </CardTitle>
              <CardDescription className="text-sm text-neutral-300">
                Enter your email and 4-digit PIN to access your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-200">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/60 border-white/15 text-white placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pin" className="text-neutral-200">
                        4-Digit PIN
                      </Label>
                      <Link
                        href="/forgot-pin"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot PIN?
                      </Link>
                    </div>
                    <Input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      required
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => {
                        // Only allow numbers
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setPin(val)
                      }}
                      className="bg-black/60 border-white/15 text-white placeholder:text-neutral-500 tracking-widest text-lg"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-blue-500 text-black font-semibold hover:bg-blue-400 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>

            <div className="flex items-center justify-center px-6 pb-6 text-sm text-neutral-300">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                ← Back to home
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
