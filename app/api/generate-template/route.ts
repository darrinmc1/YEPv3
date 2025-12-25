import { NextResponse } from 'next/server'
import { generateTemplateContent } from '@/lib/services/gemini'
import { templates } from '@/lib/data/templates'

export async function POST(request: Request) {
    try {
        const { templateId, businessContext } = await request.json()

        if (!templateId) {
            return NextResponse.json(
                { error: 'Template ID is required' },
                { status: 400 }
            )
        }

        const template = templates.find((t) => t.id === templateId)

        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            )
        }

        const content = await generateTemplateContent(
            template.name,
            template.description,
            businessContext
        )

        return NextResponse.json({ content })
    } catch (error) {
        console.error('Template generation API error:', error)
        return NextResponse.json(
            { error: 'Failed to generate template' },
            { status: 500 }
        )
    }
}
