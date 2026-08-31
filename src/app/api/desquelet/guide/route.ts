import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { launchPdfBrowser } from "@/lib/pdf-browser"
import { DESQUELET_STAGE_MAP, DESQUELET_STAGE_ORDER } from "@/lib/desquelet-prompts"

export const maxDuration = 60

const STAGES_HTML = DESQUELET_STAGE_ORDER.map((key, i) => {
  const cfg = DESQUELET_STAGE_MAP[key]
  return `
    <tr>
      <td><span class="stage-letter">${cfg.letter}</span></td>
      <td><strong>${cfg.name}</strong><br/><span class="muted">${key === cfg.letter ? "" : "Stage " + key}</span></td>
      <td>${cfg.description}</td>
    </tr>`
}).join("")

function buildHtml(userName: string, generatedAt: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #1e2434; font-size: 11.5px; line-height: 1.55; margin: 0; }
  .page-break { page-break-before: always; }

  .cover { text-align: center; padding-top: 120px; }
  .cover .brand { font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #7c7f9a; margin-bottom: 16px; }
  .cover h1 { font-size: 40px; color: #4f46e5; margin: 8px 0 4px; letter-spacing: 1px; }
  .cover h2 { font-size: 18px; color: #8a8fa8; font-weight: 400; margin: 0 0 40px; }
  .cover .rule { width: 90px; height: 4px; background: #4f46e5; border-radius: 2px; margin: 24px auto; }
  .cover .meta { color: #6b7085; font-size: 12px; line-height: 1.9; }
  .cover .tag { display: inline-block; padding: 4px 14px; border: 1px solid #c7cbe2; border-radius: 999px; color: #4f46e5; font-size: 11px; margin-top: 12px; }

  h1.section { font-size: 20px; color: #4f46e5; border-bottom: 2px solid #e0e3f5; padding-bottom: 8px; margin: 0 0 16px; }
  h2.sub { font-size: 14px; color: #273049; margin: 22px 0 8px; }
  h3.sub2 { font-size: 12.5px; color: #4f46e5; margin: 16px 0 6px; }
  p { margin: 6px 0; }
  ul, ol { margin: 6px 0 6px 0; padding-left: 20px; }
  li { margin: 4px 0; }
  .muted { color: #8a8fa8; }
  strong { color: #1f2740; }

  .role-header { display: flex; align-items: center; gap: 10px; margin: 22px 0 10px; }
  .role-header .badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .5px; color: #fff; }
  .badge.fellow { background: #4f46e5; }
  .badge.assessor { background: #0f766e; }
  .badge.admin { background: #b45309; }
  .role-header h2 { margin: 0; font-size: 15px; color: #1f2740; }

  table { width: 100%; border-collapse: collapse; margin: 10px 0 4px; }
  th, td { border: 1px solid #e2e6f2; padding: 8px 10px; text-align: left; vertical-align: top; font-size: 11px; }
  th { background: #f1f3fb; color: #36406b; font-weight: 600; }
  td .stage-letter { display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 8px; background: #eef0fb; color: #4f46e5; font-weight: 700; font-size: 13px; }

  .status-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 600; }
  .st-pending { background: #e0e7ff; color: #3730a3; }
  .st-approved { background: #dcfce7; color: #166534; }
  .st-revision { background: #fef3c7; color: #92400e; }
  .st-evidence { background: #fee2e2; color: #991b1b; }

  .callout { border-left: 4px solid #4f46e5; background: #f6f7fc; padding: 10px 14px; margin: 12px 0; border-radius: 0 8px 8px 0; }
  .callout.warn { border-left-color: #b45309; background: #fdf8ef; }
  .callout.green { border-left-color: #0f766e; background: #f0faf9; }
  .callout .title { font-weight: 700; font-size: 11.5px; margin-bottom: 4px; }
  .callout p, .callout li { font-size: 11px; }

  .step { display: flex; gap: 12px; margin: 10px 0; }
  .step .num { flex: 0 0 26px; height: 26px; border-radius: 999px; background: #4f46e5; color: #fff; font-weight: 700; font-size: 12px; text-align: center; line-height: 26px; }
  .step .body { flex: 1; }
  .step .body p { margin: 2px 0; }

  .footer-note { margin-top: 26px; padding-top: 12px; border-top: 1px solid #e2e6f2; color: #9aa0b8; font-size: 10px; }
</style>
</head>
<body>

<div class="cover">
  <div class="brand">The Borderless Project</div>
  <h1>DESQUELET&reg;</h1>
  <h2>User Guide &mdash; Applying the DESQUELET methodology</h2>
  <div class="rule"></div>
  <div class="meta">
    A practical guide for <strong>Individuals (Fellows)</strong>, <strong>Assessors</strong>, and <strong>Admins</strong><br/>
    Generated for: <strong>${userName}</strong><br/>
    ${generatedAt}
  </div>
  <div class="tag">Global Strategist Fellowship</div>
</div>

<div class="page-break"></div>

<h1 class="section">1. What is DESQUELET?</h1>
<p>
  <strong>DESQUELET</strong> is a structured methodology used by Global Strategist Fellows to document and
  demonstrate how they apply rigorous design and strategy thinking to real project work. Each <strong>DESQUELET
  Application Record</strong> corresponds to one project workstream you are contributing to, and walks you
  through <strong>nine stages</strong> &mdash; from deep understanding of the problem to the transferability of your approach.
</p>
<p>
  Your record builds an <strong>evidence chain</strong> for your profile:
  <em>PROJECT &rarr; WORK &rarr; EVIDENCE &rarr; ASSESSMENT &rarr; VERIFICATION</em>. Stage content, evidence files and
  assessor feedback become <strong>verifiable project experience</strong> that appears on your public strategist profile.
</p>

<h2 class="sub">The nine stages</h2>
<table>
  <thead>
    <tr><th style="width:8%">Stage</th><th style="width:34%">Name</th><th>What it covers</th></tr>
  </thead>
  <tbody>
  ${STAGES_HTML}
  </tbody>
</table>

<h2 class="sub">Three roles</h2>
<table>
  <thead><tr><th style="width:18%">Role</th><th>Responsibility</th></tr></thead>
  <tbody>
    <tr>
      <td><span class="status-pill st-pending">Individual / Fellow</span></td>
      <td>Creates DESQUELET records for project work, completes the nine stages with responses and evidence,
          submits stages for review, responds to feedback, and controls what is shown publicly.</td>
    </tr>
    <tr>
      <td><span class="status-pill st-approved">Assessor</span></td>
      <td>Reviews submitted stages, records a decision (approved, revision required, further evidence required)
          with written feedback that becomes part of the Fellow&rsquo;s verified profile evidence.</td>
    </tr>
    <tr>
      <td><span class="status-pill st-revision">Admin</span></td>
      <td>Full platform access: views and manages any record, promotes users to Assessor, and oversees the
          DESQUELET workflow across Fellows.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<div class="role-header">
  <span class="badge fellow">INDIVIDUAL / FELLOW</span>
  <h2>Your guide to working through DESQUELET</h2>
</div>

<h3 class="sub2">Getting started</h3>
<ol>
  <li>Open the <strong>DESQUELET Application Records</strong> page (from your dashboard or the <em>My Projects / DESQUELET</em> link in the sidebar).</li>
  <li>Click <strong>New Record</strong> to browse projects, then join or open a project you contribute to.</li>
  <li>If you contribute to a project that has no record yet, it appears in <strong>Your Existing Projects</strong> with a
      <strong>Start DESQUELET</strong> button &mdash; click it to create the record for that workstream.</li>
  <li>Every record is unique per project, so create one record for each workstream you apply the methodology to.</li>
</ol>

<h3 class="sub2">Inside the workspace</h3>
<p>Click any record to open its <strong>workspace</strong>. The left panel lists the nine stages (green = complete, blue = in progress, grey = not started). Around the stage area you&rsquo;ll see:</p>
<ul>
  <li><strong>Progress bar</strong> &mdash; your overall completion across all stages.</li>
  <li><strong>Current revision</strong> (V1, V2&hellip;) and <strong>iteration count</strong> &mdash; your revision history.</li>
  <li><strong>Visibility switcher</strong> &mdash; Private / Assessor / Public (see <em>Privacy &amp; your public profile</em> below).</li>
  <li><strong>PDF</strong> &mdash; export the full record (all stages, evidence list and reviews) as a download.</li>
</ul>

<h3 class="sub2">Completing a stage</h3>
<div class="step"><div class="num">1</div><div class="body"><p><strong>Write your response.</strong> Each stage lists guided prompts. Answer them in the <em>Response</em> box to reflect your actual work.</p></div></div>
<div class="step"><div class="num">2</div><div class="body"><p><strong>Add references and notes.</strong> Attach reference links and supporting notes to strengthen the stage.</p></div></div>
<div class="step"><div class="num">3</div><div class="body"><p><strong>Attach evidence.</strong> Use the evidence panel to upload files (documents, images, spreadsheets, simulations) that prove your work.</p></div></div>
<div class="step"><div class="num">4</div><div class="body"><p><strong>Complete the stage.</strong> Your stage progress percentage updates as you finish each part. A stage is complete at 100%.</p></div></div>

<h3 class="sub2">Submitting for review</h3>
<p>When a stage is ready, click <strong>Submit for review</strong>. This creates a <strong>Pending</strong> review for every available
Assessor so your work can be evaluated. Only one pending submission is allowed per stage at a time.</p>

<h3 class="sub2">Review statuses &amp; feedback</h3>
<table>
  <thead><tr><th style="width:26%">Status</th><th>What it means &amp; what to do</th></tr></thead>
  <tbody>
    <tr><td><span class="status-pill st-pending">Pending Review</span></td><td>Your stage is awaiting assessor feedback. Nothing to do yet.</td></tr>
    <tr><td><span class="status-pill st-approved">Approved</span></td><td>The stage meets the DESQUELET standard. Read the feedback, then move on to the next stage.</td></tr>
    <tr><td><span class="status-pill st-revision">Revision Required</span></td><td>Approved subject to <strong>minor revision</strong>. Address the feedback, finish the edits, and resubmit.</td></tr>
    <tr><td><span class="status-pill st-evidence">Further Evidence Required</span></td><td>The assessor needs more proof. Add the requested evidence to the stage and resubmit.</td></tr>
  </tbody>
</table>

<h3 class="sub2">Iterations &amp; milestones</h3>
<ul>
  <li><strong>Iterate to an earlier stage</strong> when a revision needs to be reworked &mdash; choose the target stage and add a reason. Iterations appear on the stage timeline.</li>
  <li><strong>Add milestones</strong> to mark meaningful progress points (e.g., versioned project deliverables) and track them along with the revision counter.</li>
</ul>

<div class="callout green">
  <div class="title">Privacy &amp; your public profile</div>
  <p>Every record has three visibility levels:
    <strong>Private</strong> (only you), <strong>Assessor</strong> (you and assessors), and <strong>Public</strong> (shown on your public strategist profile).
    When a record is Public, your profile shows the DESQUELET progression plus a
    <strong>Verified Assessment &amp; Feedback</strong> panel built from completed assessor reviews.
    Pending reviews are never shown publicly &mdash; only final decisions.</p>
</div>

<div class="page-break"></div>

<div class="role-header">
  <span class="badge assessor">ASSESSOR</span>
  <h2>Your guide to reviewing DESQUELET work</h2>
</div>

<h3 class="sub2">Who is an Assessor?</h3>
<p>Assessors are platform users with the <strong>Publish Assessor</strong> flag enabled (Admins are always able to assess).
When a Fellow submits a stage, the platform automatically creates a <strong>Pending</strong> review task for every
Active Admin and Publish Assessor, so each submitted stage reaches the review queue automatically.</p>

<h3 class="sub2">Recording a decision</h3>
<p>For each pending review you are assigned, you evaluate the stage response, references, and evidence and record one of three decisions with written feedback:</p>
<table>
  <thead><tr><th style="width:10%">Action</th><th style="width:34%">Decision</th><th>Guidance</th></tr></thead>
  <tbody>
    <tr>
      <td><span class="status-pill st-approved">Approve</span></td>
      <td><strong>Approved</strong></td>
      <td>The stage meets the DESQUELET standard. Summarise what is strong so the Fellow knows the work is verified.</td>
    </tr>
    <tr>
      <td><span class="status-pill st-revision">Revision</span></td>
      <td><strong>Revision Required</strong></td>
      <td>Approved subject to minor revision. Be specific about <em>what to change</em> so the Fellow can address it and resubmit.</td>
    </tr>
    <tr>
      <td><span class="status-pill st-evidence">Evidence</span></td>
      <td><strong>Further Evidence Required</strong></td>
      <td>More proof is needed. Name exactly which evidence (documents, simulations, data) is missing.</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <div class="title">Feedback shapes public verification</div>
  <p>Your feedback is part of the Fellow&rsquo;s public evidence chain. The stage&rsquo;s latest non-pending decision appears in the
  <strong>Verified Assessment &amp; Feedback</strong> panel on their public profile, so write constructive, specific feedback.
  A record is shown as <em>TBP Verified</em> only when every assessed stage is Approved.</p>
</div>

<h3 class="sub2">Best practice</h3>
<ul>
  <li>Check the attached <strong>evidence</strong> files before deciding &mdash; the response alone is not enough.</li>
  <li>Keep feedback <strong>specific and actionable</strong>: point to the stage and what a revision needs to demonstrate.</li>
  <li>Stage reviews are <strong>read-only everywhere else</strong> &mdash; a decision, once recorded, is final evidence on the profile.</li>
</ul>

<div class="page-break"></div>

<div class="role-header">
  <span class="badge admin">ADMIN</span>
  <h2>Your guide to managing DESQUELET</h2>
</div>

<h3 class="sub2">Building the review team</h3>
<p>Admins control who can assess DESQUELET work:</p>
<ol>
  <li>Open the <strong>Users</strong> administration page.</li>
  <li>Find the user you want to promote and choose <strong>Make Assessor</strong> (or <strong>Remove Assessor</strong> to revoke).</li>
  <li>Admins and Publish Assessors automatically receive Pending reviews whenever a Fellow submits a stage.</li>
</ol>
<div class="callout warn">
  <div class="title">Keep at least one Assessor active</div>
  <p>If no Admin or Publish Assessor exists, Fellows cannot successfully submit stages for review
  (&ldquo;No assessors available&rdquo;). Ensure the review team always has active members.</p>
</div>

<h3 class="sub2">Oversight &amp; access</h3>
<ul>
  <li>You can <strong>open any record</strong> regardless of its owner and visibility setting.</li>
  <li>You can <strong>generate the PDF export</strong> for any record.</li>
  <li>You can <strong>edit record settings</strong> (title, revision, visibility) and <strong>delete records</strong> when needed.</li>
  <li>Use the DESQUELET statistics to track records, completed stages, and overall progress across Fellows.</li>
</ul>

<h3 class="sub2">Reviewing as an Admin</h3>
<p>Admins can also act as Assessors: open any submitted stage and record an approval, a revision request, or a
request for further evidence with written feedback &mdash; exactly as described in the Assessor section.</p>

<div class="page-break"></div>

<h1 class="section">4. What the public sees</h1>
<p>On each strategist&rsquo;s public profile, Public DESQUELET records appear in two places:</p>
<ul>
  <li><strong>DESQUELET Progression</strong> &mdash; the nine stages with completion status and overall progress across a Fellow&rsquo;s records.</li>
  <li><strong>Verified Assessment &amp; Feedback</strong> &mdash; for each assessed workstream: the assessment outcome, the areas assessed, an assessor highlight quote, and expandable verified assessor reviews. The panel is branded <em>TBP Verified</em> when every assessed stage is approved.</li>
</ul>
<div class="callout">
  <div class="title">What this assessment verifies</div>
  <p>The verified assessment confirms that the Fellow&rsquo;s work and application of the DESQUELET&reg; methodology was
  independently assessed and reviewed. It does <strong>not</strong> certify engineering design or construction.
  Only completed, non-pending reviews are shown; pending reviews never appear publicly.</p>
</div>

<h1 class="section">5. Quick reference</h1>
<table>
  <thead><tr><th style="width:30%">Term</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>Record</td><td>One DESQUELET application tracking the nine stages for a single project workstream.</td></tr>
    <tr><td>Stage</td><td>One of the nine methodology stages (D, E&times;3, S, Q, U, L, T).</td></tr>
    <tr><td>Submit</td><td>Send a completed stage to all Assessors for evaluation (creates pending reviews).</td></tr>
    <tr><td>Iteration</td><td>Jumping back to an earlier stage (with a recorded reason) when rework is needed.</td></tr>
    <tr><td>Revision</td><td>The version of your record work (V1, V2&hellip;) tracked to show how you refine your approach.</td></tr>
    <tr><td>Milestone</td><td>A labeled, versioned checkpoint you create to track delivery progress.</td></tr>
    <tr><td>Visibility</td><td>Private / Assessor / Public &mdash; controls who can see the record and whether it is published to your profile.</td></tr>
    <tr><td>Verified Assessment</td><td>The public panel showing completed assessor reviews and the verified outcome of your DESQUELET work.</td></tr>
  </tbody>
</table>

<div class="footer-note">
  <p>DESQUELET&reg; is a registered methodology of The Borderless Project. This guide is provided to support Fellows, Assessors, and Admins in using the DESQUELET methodology workspace.</p>
</div>

</body>
</html>`
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const generatedAt = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const userName = session.user.name ?? session.user.email ?? "User"
    const html = buildHtml(userName, generatedAt)

    let browser
    try {
      browser = await launchPdfBrowser()
    } catch {
      return NextResponse.json({ error: "PDF generation not available" }, { status: 500 })
    }

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: "domcontentloaded" })
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
      })
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=\"desquelet-user-guide.pdf\"",
        },
      })
    } finally {
      await browser.close()
    }
  } catch (err) {
    console.error("DESQUELET guide PDF error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}