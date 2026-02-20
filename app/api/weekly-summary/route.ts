// app/api/weekly-summary/route.ts
//
// Called every Sunday at 8am Brisbane by n8n workflow 05_weekly_progress_summary.json
// Sends each active user a weekly summary: tasks completed, progress %, week ahead preview.
// Adapts tone and detail based on coachingStyle and contentDepth preferences.

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Auth guard
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results: { email: string; sent: boolean; reason?: string }[] = []

  try {
    const activeRoadmaps = await prisma.roadmap.findMany({
      where: { status: 'active' },
      include: { user: { select: { email: true, name: true } } },
    })

    for (const roadmap of activeRoadmaps) {
      const userEmail = roadmap.user.email
      if (!userEmail) continue

      // Skip on_request users
      if (roadmap.nudgeFrequency === 'on_request') {
        results.push({ email: userEmail, sent: false, reason: 'on_request' })
        continue
      }

      try {
        const roadmapData = JSON.parse(roadmap.roadmapData)
        const completedIds = new Set(JSON.parse(roadmap.completedTasks || '[]'))
        const allTasks: any[] = roadmapData.tasks ?? []
        const totalTasks = allTasks.length
        const completedCount = completedIds.size
        const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

        const startDate = roadmap.startDate
        const currentPlanDay = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        const currentWeek = Math.ceil(currentPlanDay / 7)

        // Tasks completed this week (days in range)
        const weekStartDay = (currentWeek - 1) * 7 + 1
        const weekEndDay = currentWeek * 7
        const thisWeekCompleted = allTasks.filter(
          (t: any) => t.day >= weekStartDay && t.day <= weekEndDay && completedIds.has(t.id)
        )
        const thisWeekMissed = allTasks.filter(
          (t: any) => t.day >= weekStartDay && t.day <= weekEndDay && !completedIds.has(t.id) && t.day < currentPlanDay
        )

        // Next week preview
        const nextWeekTasks = allTasks
          .filter((t: any) => t.day > weekEndDay && t.day <= weekEndDay + 7)
          .slice(0, 5)

        // Generate a personalised coach comment via Gemini
        let coachComment = ''
        try {
          const apiKey = process.env.GOOGLE_GEMINI_API_KEY
          if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey)
            const model = genAI.getGenerativeModel({
              model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
              generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
            })

            const styleNote: Record<string, string> = {
              direct: 'Be direct and brief. 2-3 sentences max.',
              explain_why: 'Briefly explain what this progress means for their trajectory.',
              hand_holding: 'Warm and encouraging. Acknowledge effort specifically.',
              challenging: 'Push harder. Call out if they fell behind. One hard truth.',
            }

            const prompt = `You are a business coach. Write a weekly summary comment (2-3 sentences) for someone building: ${roadmap.title}.
Week ${currentWeek} results: ${thisWeekCompleted.length} tasks done, ${thisWeekMissed.length} missed. Overall: ${progressPct}% complete.
${styleNote[roadmap.coachingStyle] ?? styleNote.direct}
Do NOT use the word "Certainly" or "Great question". Be specific to their business.`

            const result = await model.generateContent(prompt)
            coachComment = result.response.text().trim()
          }
        } catch { /* use fallback */ }

        if (!coachComment) {
          const fallbacks: Record<string, string> = {
            direct: `Week ${currentWeek} done. ${thisWeekCompleted.length} tasks complete. Next week: ${nextWeekTasks.length} tasks on the board.`,
            explain_why: `${progressPct}% progress means you're building real momentum. ${thisWeekCompleted.length} tasks this week compounds into results next month.`,
            hand_holding: `You completed ${thisWeekCompleted.length} tasks this week — that's real progress! 😊 Next week we keep the momentum going.`,
            challenging: `${thisWeekCompleted.length} done, ${thisWeekMissed.length} missed. What's the excuse for those ${thisWeekMissed.length}? Fix it next week.`,
          }
          coachComment = fallbacks[roadmap.coachingStyle] ?? fallbacks.direct
        }

        const subject = buildWeeklySummarySubject(roadmap.coachingStyle, currentWeek, roadmap.title)
        const html = buildWeeklySummaryEmail({
          userName: roadmap.user.name ?? userEmail.split('@')[0],
          businessTitle: roadmap.title,
          currentWeek,
          totalWeeks: roadmap.totalWeeks,
          progressPct,
          completedCount,
          totalTasks,
          thisWeekCompleted,
          thisWeekMissed,
          nextWeekTasks,
          coachComment,
          firstSaleTarget: roadmap.firstSaleTarget,
          roadmapId: roadmap.id,
          contentDepth: roadmap.contentDepth,
        })

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <coach@yourexitplans.com>',
          to: userEmail,
          replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
          subject,
          html,
        })

        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { lastNudgeSent: now, lastEmailSent: now },
        })

        results.push({ email: userEmail, sent: true })
      } catch (err) {
        console.error(`Weekly summary failed for ${userEmail}:`, err)
        results.push({ email: userEmail, sent: false, reason: String(err) })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: results.filter(r => r.sent).length,
      failed: results.filter(r => !r.sent).length,
      results,
    })
  } catch (err) {
    console.error('Weekly summary error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

function buildWeeklySummarySubject(style: string, week: number, title: string): string {
  const subjects: Record<string, string> = {
    direct:       `Week ${week} wrapped — here's your score`,
    explain_why:  `Week ${week} summary: what you did and what it means`,
    hand_holding: `Your Week ${week} recap is here 📊`,
    challenging:  `Week ${week} scorecard — how'd you actually do?`,
  }
  return subjects[style] ?? `Your Week ${week} Progress Summary — ${title}`
}

interface WeeklySummaryData {
  userName: string
  businessTitle: string
  currentWeek: number
  totalWeeks: number
  progressPct: number
  completedCount: number
  totalTasks: number
  thisWeekCompleted: any[]
  thisWeekMissed: any[]
  nextWeekTasks: any[]
  coachComment: string
  firstSaleTarget: string
  roadmapId: string
  contentDepth: string
}

function buildWeeklySummaryEmail(d: WeeklySummaryData): string {
  const completedRows = d.thisWeekCompleted.slice(0, 5).map(t =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;"><span style="color:#22c55e;margin-right:8px;">✓</span><span style="font-size:14px;color:#d4d4d4;">${t.title}</span></td></tr>`
  ).join('')

  const missedRows = d.thisWeekMissed.slice(0, 3).map(t =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;"><span style="color:#f87171;margin-right:8px;">○</span><span style="font-size:14px;color:#888;">${t.title}</span></td></tr>`
  ).join('')

  const nextWeekRows = d.nextWeekTasks.slice(0, 4).map(t =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;">
      <div style="font-size:14px;font-weight:600;color:#d4d4d4;">${t.title}</div>
      ${d.contentDepth !== 'essential' ? `<div style="font-size:12px;color:#666;margin-top:2px;">${t.time_estimate ?? ''}</div>` : ''}
    </td></tr>`
  ).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 20px;">
<table width="580" cellpadding="0" cellspacing="0" style="background:#0f0f1e;border:1px solid #1e1e30;border-radius:16px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:28px 32px 20px;border-bottom:1px solid #1e1e2e;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><div style="font-weight:900;font-size:16px;color:#f97316;">YourExitPlans</div>
          <div style="font-size:13px;color:#555;margin-top:3px;">Week ${d.currentWeek} of ${d.totalWeeks} · ${d.businessTitle}</div></td>
      <td align="right"><div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.3);border-radius:99px;padding:4px 14px;display:inline-block;">
        <span style="font-size:13px;font-weight:700;color:#f97316;">${d.progressPct}% done</span></div></td>
    </tr></table>
  </td></tr>

  <!-- Progress bar -->
  <tr><td style="padding:0;"><div style="height:3px;background:#1a1a2e;">
    <div style="height:100%;width:${d.progressPct}%;background:linear-gradient(90deg,#f97316,#22c55e);"></div>
  </div></td></tr>

  <!-- Coach comment -->
  <tr><td style="padding:28px 32px;">
    <div style="font-size:15px;color:#d4d4d4;line-height:1.7;font-style:italic;border-left:3px solid #f97316;padding-left:16px;">"${d.coachComment}"</div>
  </td></tr>

  <!-- Stats row -->
  <tr><td style="padding:0 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:18px;text-align:center;border-right:1px solid #1e1e2e;">
          <div style="font-size:28px;font-weight:800;color:#22c55e;">${d.thisWeekCompleted.length}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Tasks Done</div>
        </td>
        <td style="padding:18px;text-align:center;border-right:1px solid #1e1e2e;">
          <div style="font-size:28px;font-weight:800;color:${d.thisWeekMissed.length > 0 ? '#f87171' : '#555'};">${d.thisWeekMissed.length}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Missed</div>
        </td>
        <td style="padding:18px;text-align:center;">
          <div style="font-size:18px;font-weight:800;color:#f97316;">${d.firstSaleTarget}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">First Sale Target</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${d.thisWeekCompleted.length > 0 ? `
  <!-- Completed this week -->
  <tr><td style="padding:0 32px 20px;">
    <div style="font-size:13px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;">✓ Completed this week</div>
    <table width="100%" cellpadding="0" cellspacing="0">${completedRows}</table>
  </td></tr>` : ''}

  ${d.thisWeekMissed.length > 0 ? `
  <!-- Missed this week -->
  <tr><td style="padding:0 32px 20px;">
    <div style="font-size:13px;font-weight:700;color:#f87171;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;">○ Still to do</div>
    <table width="100%" cellpadding="0" cellspacing="0">${missedRows}</table>
  </td></tr>` : ''}

  ${d.nextWeekTasks.length > 0 ? `
  <!-- Next week preview -->
  <tr><td style="padding:0 32px 20px;">
    <div style="font-size:13px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;">→ Week ${d.currentWeek + 1} preview</div>
    <table width="100%" cellpadding="0" cellspacing="0">${nextWeekRows}</table>
  </td></tr>` : ''}

  <!-- CTA -->
  <tr><td style="padding:20px 32px 28px;text-align:center;">
    <a href="https://yourexitplans.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:700;font-size:14px;">Continue Week ${d.currentWeek + 1} →</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 32px;border-top:1px solid #1e1e2e;text-align:center;">
    <div style="font-size:12px;color:#444;">
      <a href="https://yourexitplans.com/dashboard?settings=${d.roadmapId}" style="color:#f97316;text-decoration:none;">Change email frequency</a>
      &nbsp;·&nbsp;
      <a href="https://yourexitplans.com/api/roadmap-settings?pause=${d.roadmapId}" style="color:#555;text-decoration:none;">Pause emails</a>
    </div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`
}
