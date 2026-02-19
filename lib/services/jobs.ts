import { prisma } from "@/lib/prisma"

export type JobType = "TEMPLATE" | "VALIDATION" | "EXPLORE"
export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"

export async function createJob(type: JobType) {
    return await prisma.job.create({
        data: {
            type,
            status: "PENDING",
        },
    })
}

export async function updateJob(
    id: string,
    status: JobStatus,
    result?: any,
    error?: string
) {
    return await prisma.job.update({
        where: { id },
        data: {
            status,
            result: result ? JSON.stringify(result) : undefined,
            error,
        },
    })
}

export async function getJob(id: string) {
    const job = await prisma.job.findUnique({
        where: { id },
    })

    if (!job) return null

    return {
        ...job,
        result: job.result ? JSON.parse(job.result) : null,
    }
}
