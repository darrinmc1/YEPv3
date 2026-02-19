import { NextResponse } from "next/server"
import { updateJob, getJob } from "@/lib/services/jobs"
import { saveValidatedIdea } from "@/lib/services/google-sheets"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { jobId, status, result, error } = body

        if (!jobId) {
            return NextResponse.json({ error: "Job ID required" }, { status: 400 })
        }

        // Default to COMPLETED if not specified but result is present
        const finalStatus = status || (error ? "FAILED" : "COMPLETED")

        await updateJob(jobId, finalStatus, result, error)

        // Check if this was a validation job and save to Google Sheets
        if (finalStatus === "COMPLETED" && result) {
            try {
                const job = await getJob(jobId)
                if (job && job.type === "VALIDATION") {
                    // Parse result if it's a string, or use directly if object
                    const data = typeof result === 'string' ? JSON.parse(result) : result

                    await saveValidatedIdea({
                        timestamp: new Date().toISOString(),
                        email: data.email || "unknown@email.com", // Ensure n8n passes this back
                        ideaName: data.ideaName || "Unknown Idea",
                        oneLiner: data.oneLiner || "",
                        problemSolved: data.problemSolved || "",
                        targetCustomer: data.targetCustomer || "",
                        businessType: data.businessType || "",
                        industry: data.industry || "",
                        priceRange: data.priceRange || "",
                        score: data.marketValidation?.score || 0,
                        marketValidation: JSON.stringify(data.marketValidation || {}),
                        quickWins: JSON.stringify(data.quickWins || []),
                        redFlags: JSON.stringify(data.redFlags || []),
                        aiModelUsed: data.model || "Gemini-via-n8n",
                        processingTime: 0, // Not tracked in this flow
                        status: "COMPLETED"
                    })
                    console.log("Saved validation to Google Sheets")
                }
            } catch (sheetError) {
                console.error("Failed to save to Google Sheets:", sheetError)
                // Don't fail the webhook response, just log error
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Job webhook error:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}
