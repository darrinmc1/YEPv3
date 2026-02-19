"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"

function ResetPinForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [pin, setPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (pin !== confirmPin) {
            setErrorMessage("PINs do not match")
            setStatus("error")
            return
        }

        if (pin.length !== 4) {
            setErrorMessage("PIN must be 4 digits")
            setStatus("error")
            return
        }

        setStatus("loading")
        setErrorMessage("")

        try {
            const res = await fetch("/api/auth/reset-pin/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, pin })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset PIN")
            }

            setStatus("success")
            setTimeout(() => {
                router.push("/login")
            }, 3000)

        } catch (err: any) {
            setErrorMessage(err.message || "An error occurred")
            setStatus("error")
        }
    }

    if (!token) {
        return (
            <Alert variant="destructive" className="max-w-md mx-auto mt-20">
                <AlertTitle>Invalid Link</AlertTitle>
                <AlertDescription>Missing reset token. Please request a new link.</AlertDescription>
            </Alert>
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
                                <Lock className="h-5 w-5 text-blue-400" />
                                Set New PIN
                            </CardTitle>
                            <CardDescription className="text-sm text-neutral-300">
                                Enter your new 4-digit PIN below.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {status === "success" ? (
                                <div className="space-y-6">
                                    <Alert className="border-green-500/20 bg-green-500/10 text-green-200">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Success!</AlertTitle>
                                        <AlertDescription>
                                            Your PIN has been reset successfully. Redirecting to login...
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        className="w-full rounded-full bg-blue-500 text-black hover:bg-blue-400"
                                        onClick={() => router.push("/login")}
                                    >
                                        Go to Login
                                    </Button>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pin" className="text-neutral-200">
                                                New 4-Digit PIN
                                            </Label>
                                            <Input
                                                id="pin"
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={4}
                                                required
                                                placeholder="••••"
                                                value={pin}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                                                    setPin(val)
                                                }}
                                                className="bg-black/60 border-white/15 text-white placeholder:text-neutral-500 tracking-widest text-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPin" className="text-neutral-200">
                                                Confirm PIN
                                            </Label>
                                            <Input
                                                id="confirmPin"
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={4}
                                                required
                                                placeholder="••••"
                                                value={confirmPin}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                                                    setConfirmPin(val)
                                                }}
                                                className="bg-black/60 border-white/15 text-white placeholder:text-neutral-500 tracking-widest text-lg"
                                            />
                                        </div>
                                    </div>

                                    {status === "error" && (
                                        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-200">
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>{errorMessage}</AlertDescription>
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
                                                Updating PIN...
                                            </span>
                                        ) : (
                                            "Set New PIN"
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

export default function ResetPinPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}>
            <ResetPinForm />
        </Suspense>
    )
}
