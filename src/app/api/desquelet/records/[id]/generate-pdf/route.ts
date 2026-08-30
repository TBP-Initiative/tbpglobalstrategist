import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { launchPdfBrowser } from "@/lib/pdf-browser"
import { DESQUELET_STAGE_MAP, DESQUELET_STAGE_ORDER, type DesqueletStageKey } from "@/lib/desquelet-prompts"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      include: {
        project: { select: { title: true } },
        user: { select: { name: true, email: true } },
        stages: {
          include: {
            evidence: true,
            reviews: {
              include: { reviewer: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        iterations: { orderBy: { createdAt: "asc" } },
        milestones: { orderBy: { version: "asc" } },
      },
    })

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (record.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const overallProgress = record.stages.length > 0
      ? Math.round(record.stages.reduce((sum, s) => sum + s.percentageComplete, 0) / record.stages.length)
      : 0

    const stagesHtml = DESQUELET_STAGE_ORDER.map((key) => {
      const stage = record.stages.find((s) => s.stage === key)
      const config = DESQUELET_STAGE_MAP[key]
      const content = stage?.content as Record<string, unknown> | null
      const response = (content?.response as string) || "No response recorded"
      const notes = (content?.notes as string) || ""
      const links = (content?.links as { label: string; url: string }[]) || []
      const percentage = stage?.percentageComplete ?? 0

      const evidenceHtml = stage?.evidence?.length
        ? `<div class="evidence"><h4>Evidence</h4><ul>${stage.evidence.map((e) => `<li>${e.fileName} (${e.fileType})${e.description ? ` - ${e.description}` : ""}</li>`).join("")}</ul></div>`
        : ""

      const reviewHtml = stage?.reviews?.length
        ? `<div class="reviews"><h4>Assessor Reviews</h4>${stage.reviews.map((r) => `<div class="review"><span class="status ${r.status.toLowerCase()}">${r.status}</span> by ${r.reviewer?.name || "Unknown"}${r.feedback ? `<p>${r.feedback}</p>` : ""}</div>`).join("")}</div>`
        : ""

      const linksHtml = links.length
        ? `<div class="links"><h4>References</h4><ul>${links.map((l) => `<li><a href="${l.url}">${l.label || l.url}</a></li>`).join("")}</ul></div>`
        : ""

      return `
        <div class="stage">
          <h2>${config.fullName} — ${percentage}%</h2>
          <p class="description">${config.description}</p>
          <div class="response"><h4>Response</h4><p>${response.replace(/\n/g, "<br/>")}</p></div>
          ${notes ? `<div class="notes"><h4>Notes</h4><p>${notes.replace(/\n/g, "<br/>")}</p></div>` : ""}
          ${linksHtml}
          ${evidenceHtml}
          ${reviewHtml}
        </div>
      `
    }).join("")

    const iterationsHtml = record.iterations.length
      ? `<div class="iterations"><h2>Iteration History</h2><table><thead><tr><th>From</th><th>To</th><th>Reason</th><th>Date</th></tr></thead><tbody>${record.iterations.map((i) => `<tr><td>${i.fromStage}</td><td>${i.toStage}</td><td>${i.reason}</td><td>${new Date(i.createdAt).toLocaleDateString()}</td></tr>`).join("")}</tbody></table></div>`
      : ""

    const milestonesHtml = record.milestones.length
      ? `<div class="milestones"><h2>Milestone History</h2><table><thead><tr><th>Version</th><th>Label</th><th>Reason</th><th>Date</th></tr></thead><tbody>${record.milestones.map((m) => `<tr><td>V${m.version}</td><td>${m.label}</td><td>${m.reason || "-"}</td><td>${new Date(m.createdAt).toLocaleDateString()}</td></tr>`).join("")}</tbody></table></div>`
      : ""

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; }
    .header h1 { color: #4f46e5; margin: 0; font-size: 28px; }
    .header .subtitle { color: #666; margin-top: 8px; font-size: 14px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .meta-item { text-align: center; }
    .meta-item .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .meta-item .value { font-size: 18px; font-weight: bold; color: #4f46e5; }
    .stage { margin-bottom: 30px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid; }
    .stage h2 { color: #4f46e5; margin: 0 0 10px 0; font-size: 20px; }
    .description { color: #666; font-style: italic; margin-bottom: 15px; }
    .response, .notes, .links, .evidence, .reviews { margin-top: 15px; }
    h4 { color: #334155; margin: 0 0 8px 0; font-size: 14px; }
    .review { padding: 10px; margin: 5px 0; background: #f8fafc; border-radius: 4px; }
    .status { padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .status.approved { background: #dcfce7; color: #166534; }
    .status.revision_required { background: #fef3c7; color: #92400e; }
    .status.further_evidence_required { background: #fee2e2; color: #991b1b; }
    .status.pending { background: #e0e7ff; color: #3730a3; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; font-weight: 600; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #999; font-size: 12px; }
    a { color: #4f46e5; }
  </style>
</head>
<body>
  <div class="header">
    <h1>DESQUELET Application Record</h1>
    <div class="subtitle">The Borderless Project — Global Strategist Fellowship</div>
  </div>

  <div class="meta">
    <div class="meta-item"><div class="label">Fellow</div><div class="value">${record.user.name || record.user.email}</div></div>
    <div class="meta-item"><div class="label">Workstream</div><div class="value">${record.project?.title || record.title}</div></div>
    <div class="meta-item"><div class="label">Overall Progress</div><div class="value">${overallProgress}%</div></div>
    <div class="meta-item"><div class="label">Revision</div><div class="value">V${record.currentRevision}</div></div>
  </div>

  ${stagesHtml}
  ${iterationsHtml}
  ${milestonesHtml}

  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
    <p>DESQUELET is a registered methodology of The Borderless Project</p>
  </div>
</body>
</html>`

    let browser
    try {
      browser = await launchPdfBrowser()
    } catch {
      return NextResponse.json({ error: "PDF generation not available" }, { status: 500 })
    }

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "domcontentloaded" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    })

    await browser.close()

    const timestamp = Date.now()
    const filename = `desquelet-record-${record.id}-${timestamp}.pdf`

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error("DESQUELET PDF generation error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
