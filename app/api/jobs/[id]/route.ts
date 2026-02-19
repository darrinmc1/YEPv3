import { NextResponse } from "next/server"
import { getJob } from "@/lib/services/jobs"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const job = await getJob(params.id)

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        return NextResponse.json(job)
    } catch (error) {
        console.error("Job status error:", error)
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
    }
}
