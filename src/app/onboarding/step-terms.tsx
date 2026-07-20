"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface StepTermsProps {
  data: Record<string, unknown> | null
  onNext: () => void
  onBack: () => void
}

const TERMS_SECTIONS = [
  { id: 3, title: "Programme Overview", content: "The TBP Global Strategist Fellowship Programme is an educational and professional-development programme developed by The Borderless Project. The programme is designed for students, graduates, young professionals, researchers, early-career specialists and selected sector participants who wish to learn the TBP system, apply the DESQUELET\u00AE methodology, build a professional portfolio, gain applied project exposure and develop a verified record of contribution within the TBP ecosystem." },
  { id: 4, title: "Programme Duration", content: "The projected programme duration is 12\u201324 weeks. The exact duration may vary depending on the participant\u2019s chosen pathway, availability, pace of completion, assignment progress, TBP review process and programme requirements." },
  { id: 6, title: "Programme Fee and Payment Terms", content: "The programme fee is paid for participation in an educational and professional-development fellowship. The programme fee supports access to the TBP Global Strategist Fellowship onboarding process, portal activation, structured learning pathway, assignment framework, portfolio support, review process and completion documentation. The programme fee is not a payment for employment, guaranteed paid work, visa sponsorship, investment access, project appointment or any regulated service." },
  { id: 7, title: "Conditional Acceptance", content: "The participant understands that Conditional Acceptance means that TBP has accepted the participant into the next stage of the programme onboarding process. Conditional Acceptance does not guarantee final programme activation. Programme activation remains subject to completion of onboarding requirements, acceptance of this Agreement, payment or approved payment arrangement, TBP confirmation, compliance with programme requirements, and no unresolved conduct or suitability concerns." },
  { id: 8, title: "Onboarding & Pathway Alignment Session", content: "The participant may be required to attend or complete an onboarding and pathway alignment session before full programme activation. The session may cover: what TBP is, why the Fellowship Programme exists, DESQUELET\u00AE methodology, sector pathway options, programme fees, portal access, assignment and contribution tracking, certificate requirements, conduct expectations, and payment and next steps." },
  { id: 9, title: "Portal Access", content: "The TBP Global Strategist Portal is the exclusive working and portfolio platform for participants. Portal access is personal to the participant and must not be shared. Participants must not upload unlawful, confidential, misleading, offensive, infringing or unauthorised material. TBP may suspend or remove portal access where there is misuse, non-payment, breach of programme terms, misconduct, or other reasonable concern." },
  { id: 10, title: "Self-Onboarding Pack", content: "After programme activation, the participant may receive access to the TBP Global Strategist Fellowship Self-Onboarding Pack. The participant agrees to review the Self-Onboarding Pack and complete any required introductory reflection, learning tasks or onboarding assignments." },
  { id: 11, title: "Assignments and Contribution Tracking", content: "Participants may be assigned learning tasks, research tasks, project-based exercises, design briefs, technical notes, strategic memos, sector mapping activities, portfolio-development tasks or other contribution assignments. Assignments are designed for learning, development and portfolio-building purposes. Submission of work does not guarantee public publication, certificate completion, paid work, project appointment or future engagement." },
  { id: 14, title: "Refunds, Cancellations and Withdrawal", content: "Any refund, cancellation or withdrawal request will be reviewed in line with TBP\u2019s applicable programme policy and any relevant legal or consumer protection requirements. TBP may decline a refund where programme access has been activated, materials have been released, portal access has been provided, assignments have been issued, or substantial onboarding support has already been delivered." },
  { id: 15, title: "Participant Conduct", content: "Participants are expected to act professionally, respectfully and responsibly. Participants must not: misrepresent their relationship with TBP, claim to be employed by TBP without written approval, contact investors or partners on behalf of TBP without approval, use TBP materials for unauthorised purposes, submit plagiarised work, make investment or employment claims on behalf of TBP." },
  { id: 16, title: "Confidentiality", content: "During the programme, participants may receive access to TBP materials, concepts, documents, frameworks, project descriptions, strategic notes, portal content or other information not intended for public circulation. Participants agree not to disclose, copy, publish, distribute, reproduce or misuse confidential TBP materials without written approval. This obligation applies during and after programme participation." },
  { id: 17, title: "Intellectual Property", content: "TBP retains ownership of its name, brand, visual identity, logos, frameworks, documents, platform concepts, training materials, project materials, DESQUELET\u00AE methodology references, programme content, portal structure and TBP ecosystem materials. Participants retain ownership of their pre-existing personal work, knowledge, skills and background materials." },
  { id: 18, title: "Use of TBP Name and Profile Title", content: "Participants may use the title TBP Global Strategist Fellowship Participant or TBP Global Strategist Fellow, subject to TBP approval and programme standing. Participants must not use titles that imply employment, senior authority, directorship, partnership, investment authority or project appointment unless separately confirmed in writing by TBP." },
  { id: 19, title: "No Employment, Sponsorship or Guaranteed Appointment", content: "The participant acknowledges that participation does not create an employment relationship. The programme does not guarantee employment, salary, paid work, consulting appointment, project appointment, sponsorship, visa support, investment opportunity, future role within TBP, or guaranteed certificate without completion." },
  { id: 20, title: "No Financial Promotion or Regulated Activity", content: "The participant is not authorised to solicit investment, negotiate investment terms, make financial promotions, provide regulated investment advice, represent guaranteed returns, offer investment access, act as a broker, or represent TBP in any regulated capacity." },
  { id: 21, title: "Data and Privacy", content: "TBP may collect and process participant information for onboarding, payment administration, portal access, profile creation, pathway alignment, assignment review, communication, programme records, contribution tracking and completion documentation. TBP will use participant information for legitimate programme administration subject to applicable data protection requirements." },
  { id: 22, title: "Programme Changes", content: "TBP may update the programme structure, portal features, assignment format, learning materials, schedule, pathway categories, review process, contribution requirements or completion criteria where necessary. TBP will aim to communicate material changes to participants in a reasonable manner." },
  { id: 23, title: "Suspension or Termination", content: "TBP may suspend, restrict or terminate a participant\u2019s programme access where there is non-payment, misconduct, breach of programme terms, misuse of the portal, confidentiality concern, intellectual property concern, false or misleading information, reputational risk, harassment, unauthorised external outreach, misrepresentation of TBP status, or legal, regulatory or safeguarding concern." },
]

export function StepTerms({ onNext, onBack }: StepTermsProps) {
  const [readSections, setReadSections] = useState<Set<number>>(new Set())
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const allRead = readSections.size === TERMS_SECTIONS.length && scrolledToBottom

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setScrolledToBottom(true)
    }
  }

  const markRead = (id: number) => {
    setReadSections((prev) => new Set(prev).add(id))
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Programme Terms &amp; Conditions</h2>
      <p className="mt-1 text-sm text-gray-500">Please read all sections before continuing</p>

      <div
        className="mt-6 max-h-[50vh] space-y-4 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-5"
        onScroll={handleScroll}
      >
        {TERMS_SECTIONS.map((section) => (
          <div
            key={section.id}
            className={`rounded-lg border p-4 transition-colors ${
              readSections.has(section.id) ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"
            }`}
            onClick={() => markRead(section.id)}
          >
            <h3 className="text-sm font-bold text-gray-900">
              {section.id}. {section.title}
              {readSections.has(section.id) && (
                <span className="ml-2 text-xs text-green-600">✓ Read</span>
              )}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          {readSections.size}/{TERMS_SECTIONS.length} sections read
          {!scrolledToBottom && " \u2022 Scroll to bottom to continue"}
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={onNext} disabled={!allRead} className="rounded-full px-8">
          I have read all terms <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
