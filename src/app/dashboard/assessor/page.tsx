import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AssessorClient from "./assessor-client"

export const dynamic = "force-dynamic"

export default async function AssessorPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || (user.role !== "ADMIN" && !user.isPublishAssessor)) redirect("/dashboard")

  const [pendingReviews, submissions] = await Promise.all([
    prisma.desqueletReview.findMany({
      where: { reviewerId: user.id, status: "PENDING" },
      include: {
        stageContent: {
          include: {
            evidence: { orderBy: { createdAt: "desc" } },
            record: {
              select: {
                id: true,
                title: true,
                currentRevision: true,
                visibility: true,
                updatedAt: true,
                user: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.submission.findMany({
      where: { isLatest: true, status: "UNDER_REVIEW" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessor: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
        revisions: {
          select: { id: true, version: true, title: true, status: true, createdAt: true, changelog: true, assessorFeedback: true, assessorNotes: true },
          orderBy: { version: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const serializedReviews = pendingReviews.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    stage: r.stageContent.stage,
    content: r.stageContent.content,
    percentageComplete: r.stageContent.percentageComplete,
    evidence: r.stageContent.evidence.map((e) => ({
      id: e.id,
      fileName: e.fileName,
      fileUrl: e.fileUrl,
      fileType: e.fileType,
      fileSize: e.fileSize,
      description: e.description,
      category: e.category,
    })),
    record: {
      id: r.stageContent.record.id,
      title: r.stageContent.record.title,
      currentRevision: r.stageContent.record.currentRevision,
      visibility: r.stageContent.record.visibility,
      updatedAt: r.stageContent.record.updatedAt.toISOString(),
      user: r.stageContent.record.user,
      project: r.stageContent.record.project,
    },
  }))

  const serializedSubmissions = submissions.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    revisions: s.revisions.map((rev) => ({ ...rev, createdAt: rev.createdAt.toISOString() })),
  }))

  return (
    <AssessorClient
      reviews={serializedReviews}
      submissions={serializedSubmissions}
      isAdmin={user.role === "ADMIN"}
    />
  )
}
