"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"

export default function ForgotPinPage() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setStatus("loading")

        try {
            const res = await fetch("/api/auth/reset-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (!res.ok) throw new Error("Failed to send reset link")

            setStatus("success")
        } catch (err) {
            setStatus("error")
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
                                <Mail className="h-5 w-5 text-blue-400" />
                                Reset PIN
                            </CardTitle>
                            <CardDescription className="text-sm text-neutral-300">
                                Enter your email address and we&apos;ll send you a link to reset your 4-digit PIN.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {status === "success" ? (
                                <div className="space-y-6">
                                    <Alert className="border-green-500/20 bg-green-500/10 text-green-200">
                                        <AlertTitle>Check your email</AlertTitle>
                                        <AlertDescription>
                                            We&apos;ve sent a PIN reset link to <strong>{email}</strong>. It will expire in 1 hour.
                                        </AlertDescription>
                                    </Alert>
                                    <Link href="/login">
                                        <Button variant="outline" className="w-full rounded-full border-white/20 text-white hover:bg-white/10">
                                            Back to Login
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={handleSubmit}>
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

                                    {status === "error" && (
                                        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-200">
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>Could not send reset link. Please try again.</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full rounded-full bg-blue-500 text-black font-semibold hover:bg-blue-400 transition-all"
                                    >
                                        {status === "loading" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Sending Link...
                                            </span>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>

                        <div className="flex items-center justify-center px-6 pb-6 text-sm text-neutral-300">
                            <Link href="/login" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </Card>
                </div>
            </main>
        </>
    )
}
