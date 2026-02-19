/**
 * n8n Webhook Service
 * Handles communication with n8n workflows for AI processing
 */

export async function callN8nWebhook(url: string | undefined, payload: any): Promise<any> {
    if (!url) {
        throw new Error('N8N Webhook URL not configured')
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            // Set a reasonable timeout
            signal: AbortSignal.timeout(30000), // 30 seconds
        })

        if (!response.ok) {
            throw new Error(`N8N Webhook failed with status ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('N8N Webhook error:', error)
        throw error // Re-throw to allow fallback mechanisms to work
    }
}
