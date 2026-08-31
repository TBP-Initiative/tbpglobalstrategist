import Link from "next/link"
import { GlassCard } from "@/components/shared/glass-card"
import { ArrowLeft, Download, FileText, ExternalLink, BookOpen } from "lucide-react"

const DESQUELET_TEMPLATE_DOWNLOAD = "/docs/desquelet-application-record-template.docx"

const stages = [
  { letter: "D", name: "Deep Understanding", desc: "Demonstrate your understanding of the core problem or challenge you are addressing." },
  { letter: "E", name: "Exploration of Systems", desc: "Map the systems, structures, and forces that shape this challenge." },
  { letter: "S", name: "Strategic Planning", desc: "Develop a clear strategic approach to addressing the challenge." },
  { letter: "Q", name: "Questioning", desc: "Challenge assumptions and ask critical questions that refine your approach." },
  { letter: "U", name: "Unique Framing", desc: "Develop a distinctive perspective or framing that sets your approach apart." },
  { letter: "E", name: "Effective Engagement", desc: "Demonstrate how you engage with stakeholders, teams, and the challenge itself." },
  { letter: "L", name: "Learning Through Simulation", desc: "Test your approach through simulation, prototyping, or modelling." },
  { letter: "E", name: "Execution Model", desc: "Define how your approach will be implemented in practice." },
  { letter: "T", name: "Transferability", desc: "Demonstrate how your work can be applied beyond the immediate context." },
]

export default function DesqueletGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard/desquelet" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft size={16} />
            Back to Records
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            <BookOpen size={14} /> DESQUELET® User Guide
          </span>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">DESQUELET<sup>®</sup></h1>
          <p className="mt-2 text-gray-500">A practical guide for Individuals (Fellows), Assessors, and Admins</p>
          <p className="text-sm text-gray-400">The Borderless Project — Global Strategist Fellowship</p>
        </header>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-indigo-700">What is DESQUELET?</h2>
          <p className="text-gray-600 leading-relaxed">
            DESQUELET is a structured methodology Global Strategist Fellows use to document how they apply rigorous design and
            strategy thinking to real project work. Each <strong>DESQUELET Application Record</strong> corresponds to one project
            workstream and walks you through <strong>nine stages</strong> — from deep understanding of the problem to the transferability
            of your approach. Your record builds an evidence chain:{" "}
            <em>PROJECT → WORK → EVIDENCE → ASSESSMENT → VERIFICATION</em>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">The nine stages</h2>
          <div className="space-y-3">
            {stages.map((item) => (
              <div key={item.name} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-lg font-bold text-indigo-700">
                  {item.letter}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">Roles</h2>
          <div className="space-y-3">
            <GlassCard className="p-4" intensity="light">
              <p className="font-medium text-gray-900">Individual / Fellow</p>
              <p className="text-sm text-gray-500">Create DESQUELET records for project work, complete the nine stages with responses and evidence, submit stages for review, respond to feedback, and control visibility.</p>
            </GlassCard>
            <GlassCard className="p-4" intensity="light">
              <p className="font-medium text-gray-900">Assessor</p>
              <p className="text-sm text-gray-500">Review submitted stages and record a decision (approved, revision required, further evidence required) with written feedback that becomes part of the Fellow&apos;s verified profile evidence.</p>
            </GlassCard>
            <GlassCard className="p-4" intensity="light">
              <p className="font-medium text-gray-900">Admin</p>
              <p className="text-sm text-gray-500">Full platform access: view and manage any record, promote users to Assessor, and oversee the DESQUELET workflow.</p>
            </GlassCard>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">Download the template & upload your report</h2>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-700" />
              <p className="font-medium text-gray-900">DESQUELET Methodology Report Template</p>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Download the official template, fill it in for your project workstream, then upload the completed DOCX on the
              Research Outputs &amp; Submissions section of your dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={DESQUELET_TEMPLATE_DOWNLOAD} download>
                <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <Download size={15} /> Download Template
                </span>
              </a>
              <Link href="/dashboard/individual">
                <span className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50">
                  <ExternalLink size={15} /> Go to Research Outputs & Submissions
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">Working through the stages</h2>
          <ol className="list-decimal space-y-2 pl-5 text-gray-600">
            <li><strong>Write your response</strong> — each stage lists guided prompts; answer them to reflect your actual work.</li>
            <li><strong>Add references and notes</strong> — attach links and supporting notes.</li>
            <li><strong>Attach evidence</strong> — upload files that prove your work.</li>
            <li><strong>Complete the stage</strong> — progress updates as you finish each part (100% = done).</li>
            <li><strong>Submit for review</strong> — creates a Pending review for Assessors.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">Review statuses</h2>
          <div className="space-y-3">
            <GlassCard className="p-4" intensity="light">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Pending Review</span>
                <p className="font-medium text-gray-900">Awaiting assessor feedback</p>
              </div>
              <p className="text-sm text-gray-500">Nothing to do — your stage is in the assessor queue.</p>
            </GlassCard>
            <GlassCard className="p-4" intensity="light">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Approved</span>
                <p className="font-medium text-gray-900">Meets the DESQUELET standard</p>
              </div>
              <p className="text-sm text-gray-500">Read the feedback, then move to the next stage.</p>
            </GlassCard>
            <GlassCard className="p-4" intensity="light">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Revision Required</span>
                <p className="font-medium text-gray-900">Approved subject to minor revision</p>
              </div>
              <p className="text-sm text-gray-500">Address the feedback, finish edits, and resubmit.</p>
            </GlassCard>
            <GlassCard className="p-4" intensity="light">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Further Evidence Required</span>
                <p className="font-medium text-gray-900">Needs more proof</p>
              </div>
              <p className="text-sm text-gray-500">Add the requested evidence and resubmit.</p>
            </GlassCard>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">Iterations, milestones & privacy</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li><strong>Iterate to an earlier stage</strong> when a revision needs rework — choose the target stage and add a reason.</li>
            <li><strong>Add milestones</strong> to mark meaningful progress points.</li>
            <li><strong>Visibility</strong>: Private (only you), Assessor (you + assessors), or Public (shown on your public profile). When Public, your profile shows progression plus a Verified Assessment &amp; Feedback panel from completed reviews.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-indigo-700">What the public sees</h2>
          <p className="mb-3 text-gray-600">
            On each strategist&apos;s public profile, Public DESQUELET records appear as <strong>DESQUELET Progression</strong> and
            a <strong>Verified Assessment &amp; Feedback</strong> panel. The panel shows completed assessor reviews and the verified
            outcome of the work. Pending reviews are never shown publicly.
          </p>
          <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/60 p-4">
            <p className="text-sm font-semibold text-gray-900">What this assessment verifies</p>
            <p className="text-sm text-gray-600 mt-1">
              The verified assessment confirms the Fellow&apos;s work and application of the DESQUELET® methodology was independently
              assessed and reviewed. It does <strong>not</strong> certify engineering design or construction.
            </p>
          </div>
        </section>

        <footer className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>DESQUELET® is a registered methodology of The Borderless Project.</p>
        </footer>
      </div>
    </div>
  )
}
