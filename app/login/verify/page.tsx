import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <Card className="backdrop-blur-xl border border-white/10 bg-black/50 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              Check your email
            </CardTitle>
            <CardDescription className="text-neutral-300">
              We sent you a magic link. Open it to finish signing in. The link expires in 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-400">
              Didn&apos;t get it yet? Give it up to a minute and check spam. If SMTP is not configured, set the env vars
              shown in <code>.env.example</code>.
            </p>
            <div className="flex justify-end">
              <Button asChild className="rounded-full bg-blue-500 text-black hover:bg-blue-400">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
