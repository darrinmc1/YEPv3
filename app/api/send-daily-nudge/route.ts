// app/api/send-daily-nudge/route.ts
//
// Called by n8n (or any cron job) every morning at 7am Brisbane time.
// Loops through all active roadmaps and sends the right email based on
// each user's nudgeFrequency setting and when they last received an email.
//
// n8n setup: Schedule Trigger → HTTP Request POST to /api/send-daily-nudge
// with header: x-cron-secret = your CRON_SECRET env var
//
// To trigger manually for testing:
//   curl -X POST https://yourexitplans.com/api/send-daily-nudge \
//        -H "x-cron-secret: your-secret-here"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── How many days between nudges per frequency setting ──────────────────────

const NUDGE_INTERVAL_DAYS: Record<string, number> = {
  daily:          1,
  every_few_days: 3,
  weekly:         7,
  on_request:     9999, // never auto-send
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Protect this endpoint — only n8n / cron should call it
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results: { email: string; sent: boolean; reason?: string }[] = []

  try {
    // Get all active roadmaps with their user's email
    const activeRoadmaps = await prisma.roadmap.findMany({
      where: { status: 'active' },
      include: {
        user: { select: { email: true, name: true } }
      }
    })

    for (const roadmap of activeRoadmaps) {
      const userEmail = roadmap.user.email
      if (!userEmail) continue

      // Skip if nudge frequency is on_request
      if (roadmap.nudgeFrequency === 'on_request') {
        results.push({ email: userEmail, sent: false, reason: 'on_request' })
        continue
      }

      // Check if enough days have passed since last nudge
      const intervalDays = NUDGE_INTERVAL_DAYS[roadmap.nudgeFrequency] ?? 7
      if (roadmap.lastNudgeSent) {
        const daysSinceLast = Math.floor(
          (now.getTime() - roadmap.lastNudgeSent.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysSinceLast < intervalDays) {
          results.push({ email: userEmail, sent: false, reason: `too_soon (${daysSinceLast}d < ${intervalDays}d)` })
          continue
        }
      }

      // Calculate current day of their plan
      const startDate = roadmap.startDate
      const currentPlanDay = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Get today's tasks from the stored roadmap JSON
      let todaysTasks: any[] = []
      let upcomingTasks: any[] = []
      try {
        const roadmapData = JSON.parse(roadmap.roadmapData)
        const completedIds = new Set(JSON.parse(roadmap.completedTasks || '[]'))

        // For daily: today's tasks only
        // For weekly: next 7 days of tasks
        const lookAheadDays = roadmap.nudgeFrequency === 'weekly' ? 7 : 1

        todaysTasks = roadmapData.tasks
          ?.filter((t: any) => t.day === currentPlanDay && !completedIds.has(t.id)) ?? []

        upcomingTasks = roadmapData.tasks
          ?.filter((t: any) => t.day > currentPlanDay && t.day <= currentPlanDay + lookAheadDays && !completedIds.has(t.id)) ?? []

        // Completed count for progress
        const totalTasks = roadmapData.tasks?.length ?? 0
        const completedCount = completedIds.size
        const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

        const emailHtml = buildNudgeEmail({
          userName: roadmap.user.name ?? userEmail.split('@')[0],
          businessTitle: roadmap.title,
          currentDay: currentPlanDay,
          totalWeeks: roadmap.totalWeeks,
          nudgeFrequency: roadmap.nudgeFrequency,
          coachingStyle: roadmap.coachingStyle,
          contentDepth: roadmap.contentDepth,
          todaysTasks,
          upcomingTasks,
          progressPct,
          firstSaleTarget: roadmap.firstSaleTarget,
          roadmapId: roadmap.id,
        })

        const subject = buildSubject(roadmap.nudgeFrequency, roadmap.coachingStyle, currentPlanDay, roadmap.title)

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <coach@yourexitplans.com>',
          to: userEmail,
          replyTo: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
          subject,
          html: emailHtml,
        })

        // Update lastNudgeSent
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { lastNudgeSent: now, lastEmailSent: now }
        })

        results.push({ email: userEmail, sent: true })
      } catch (err) {
        console.error(`Failed to send nudge to ${userEmail}:`, err)
        results.push({ email: userEmail, sent: false, reason: String(err) })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: results.filter(r => r.sent).length,
      skipped: results.filter(r => !r.sent).length,
      results,
    })
  } catch (err) {
    console.error('Daily nudge error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// ─── Build subject line based on coaching style ───────────────────────────────

function buildSubject(frequency: string, style: string, day: number, title: string): string {
  const dayLabel = `Day ${day}`

  if (frequency === 'weekly') {
    const subjects: Record<string, string> = {
      direct:       `Week ${Math.ceil(day / 7)} tasks for ${title}`,
      explain_why:  `Your week ${Math.ceil(day / 7)} roadmap — here's what to focus on`,
      hand_holding: `Your friendly weekly check-in 👋 — ${title}`,
      challenging:  `Week ${Math.ceil(day / 7)}: Are you ahead or behind? — ${title}`,
    }
    return subjects[style] ?? `Your weekly roadmap update — ${title}`
  }

  const subjects: Record<string, string> = {
    direct:       `${dayLabel}: Your tasks for today`,
    explain_why:  `${dayLabel}: Here's what to do and why`,
    hand_holding: `${dayLabel}: Let's take this one step at a time 😊`,
    challenging:  `${dayLabel}: No excuses. What are you doing today?`,
  }
  return subjects[style] ?? `${dayLabel}: Your roadmap update`
}

// ─── Build nudge email HTML ───────────────────────────────────────────────────

interface NudgeEmailData {
  userName: string
  businessTitle: string
  currentDay: number
  totalWeeks: number
  nudgeFrequency: string
  coachingStyle: string
  contentDepth: string
  todaysTasks: any[]
  upcomingTasks: any[]
  progressPct: number
  firstSaleTarget: string
  roadmapId: string
}

function buildNudgeEmail(data: NudgeEmailData): string {
  const {
    userName, businessTitle, currentDay, totalWeeks, nudgeFrequency,
    coachingStyle, contentDepth, todaysTasks, upcomingTasks,
    progressPct, firstSaleTarget, roadmapId
  } = data

  const currentWeek = Math.ceil(currentDay / 7)
  const isWeekly = nudgeFrequency === 'weekly'

  // Coaching style greeting
  const greetings: Record<string, string> = {
    direct:       `Here's what's on your plate${isWeekly ? ` this week` : ` today`}.`,
    explain_why:  `Here's your focus${isWeekly ? ` this week` : ` today`} — and why each task matters.`,
    hand_holding: `Good${currentDay < 30 ? ' morning' : ''} ${userName}! Let's take this one step at a time.`,
    challenging:  `Day ${currentDay}. Still going? Good. Here's what you need to get done.`,
  }
  const greeting = greetings[coachingStyle] ?? `Here's your update for Day ${currentDay}.`

  const displayTasks = isWeekly ? [...todaysTasks, ...upcomingTasks].slice(0, 10) : todaysTasks.slice(0, 5)

  const taskRows = displayTasks.length > 0
    ? displayTasks.map(task => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1e1e2e;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="28">
                <div style="width:20px;height:20px;border-radius:5px;border:2px solid #2a2a3e;display:inline-block;"></div>
              </td>
              <td style="padding-left:10px;">
                <div style="font-size:15px;font-weight:600;color:#f5f5f0;margin-bottom:3px;">${task.title}</div>
                ${contentDepth !== 'essential' ? `<div style="font-size:13px;color:#888;line-height:1.5;margin-bottom:4px;">${task.description}</div>` : ''}
                <div style="font-size:12px;color:#555;">⏱ ${task.time_estimate} &nbsp;·&nbsp; ${task.phase_name}</div>
                ${task.completion_criteria && contentDepth === 'deep_dive' ? `<div style="font-size:12px;color:#22c55e;margin-top:4px;">✓ Done when: ${task.completion_criteria}</div>` : ''}
              </td>
              ${isWeekly ? `<td width="50" style="text-align:right;font-size:12px;color:#555;white-space:nowrap;">Day ${task.day}</td>` : ''}
            </tr>
          </table>
        </td>
      </tr>
    `).join('')
    : `<tr><td style="padding:20px 0;color:#888;font-size:14px;text-align:center;">You're all caught up! No tasks scheduled${isWeekly ? ' this week' : ' today'}. Rest day. 🎉</td></tr>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#08080f;">
<tr><td align="center" style="padding:32px 20px;">
<table width="580" cellpadding="0" cellspacing="0" style="background:#0f0f1e;border:1px solid #1e1e30;border-radius:16px;overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="padding:28px 32px 20px;border-bottom:1px solid #1e1e2e;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-weight:900;font-size:16px;color:#f97316;margin-bottom:4px;">YourExitPlans</div>
            <div style="font-size:13px;color:#555;">${isWeekly ? `Week ${currentWeek}` : `Day ${currentDay}`} of ${totalWeeks * 7} days · ${businessTitle}</div>
          </td>
          <td align="right">
            <div style="display:inline-block;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:99px;padding:4px 12px;">
              <span style="font-size:13px;font-weight:700;color:#22c55e;">${progressPct}% complete</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Progress bar -->
  <tr>
    <td style="padding:0;">
      <div style="height:3px;background:#1a1a2e;">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,#f97316,#ef4444);"></div>
      </div>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:24px 32px 16px;">
      <div style="font-size:18px;font-weight:700;color:#f5f5f0;margin-bottom:6px;">
        ${isWeekly ? `Your Week ${currentWeek} Tasks` : `Today's Focus`}
      </div>
      <div style="font-size:14px;color:#888;line-height:1.6;">${greeting}</div>
    </td>
  </tr>

  <!-- Tasks -->
  <tr>
    <td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${taskRows}
      </table>
    </td>
  </tr>

  <!-- Stats row -->
  <tr>
    <td style="padding:16px 32px;background:#0a0a14;border-top:1px solid #1e1e2e;border-bottom:1px solid #1e1e2e;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;border-right:1px solid #1e1e2e;padding:0 16px 0 0;">
            <div style="font-size:20px;font-weight:800;color:#f97316;">${currentDay}</div>
            <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Current Day</div>
          </td>
          <td style="text-align:center;padding:0 16px;">
            <div style="font-size:20px;font-weight:800;color:#f97316;">${progressPct}%</div>
            <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Progress</div>
          </td>
          <td style="text-align:center;border-left:1px solid #1e1e2e;padding:0 0 0 16px;">
            <div style="font-size:14px;font-weight:700;color:#f97316;">${firstSaleTarget}</div>
            <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">First Sale Target</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:24px 32px;text-align:center;">
      <a href="https://yourexitplans.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
        Open My Roadmap →
      </a>
    </td>
  </tr>

  <!-- Settings reminder -->
  <tr>
    <td style="padding:0 32px 24px;text-align:center;">
      <div style="font-size:12px;color:#444;line-height:1.6;">
        You're receiving this because you chose <strong style="color:#666;">${nudgeFrequency.replace('_', ' ')}</strong> updates.
        <br>
        <a href="https://yourexitplans.com/dashboard?settings=${roadmapId}" style="color:#f97316;text-decoration:none;">Change update frequency</a>
        &nbsp;·&nbsp;
        <a href="https://yourexitplans.com/api/roadmap-settings?pause=${roadmapId}" style="color:#555;text-decoration:none;">Pause emails</a>
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
