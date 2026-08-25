"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  status: string
  feedback: string | null
  createdAt: string
  reviewer?: { id: string; name: string | null; email: string }
}

interface DesqueletReviewPanelProps {
  reviews: Review[]
  className?: string
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Pending Review",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: <Clock size={14} />,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-50 text-green-600 border-green-200",
    icon: <CheckCircle2 size={14} />,
  },
  REVISION_REQUIRED: {
    label: "Revision Required",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    icon: <XCircle size={14} />,
  },
  FURTHER_EVIDENCE_REQUIRED: {
    label: "Further Evidence Required",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: <AlertCircle size={14} />,
  },
}

export function DesqueletReviewPanel({
  reviews,
  className,
}: DesqueletReviewPanelProps) {
  if (reviews.length === 0) {
    return (
      <GlassCard className={className} intensity="light">
        <div className="p-4 text-center">
          <Clock size={24} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No reviews yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Submit your stage for assessor review
          </p>
        </div>
      </GlassCard>
    )
  }

  const latestReview = reviews[0]
  const config = statusConfig[latestReview.status] || statusConfig.PENDING

  return (
    <GlassCard className={className} intensity="light">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Assessor Review</h4>
          <Badge
            variant="outline"
            className={cn("flex items-center gap-1", config.color)}
          >
            {config.icon}
            {config.label}
          </Badge>
        </div>

        <div className="space-y-3">
          {reviews.map((review, index) => {
            const reviewConfig = statusConfig[review.status] || statusConfig.PENDING
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", reviewConfig.color)}
                    >
                      {reviewConfig.icon}
                      {reviewConfig.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.feedback && (
                  <p className="text-sm text-gray-600 mt-2">{review.feedback}</p>
                )}
                {review.reviewer && (
                  <p className="text-xs text-gray-400 mt-2">
                    Reviewed by {review.reviewer.name || review.reviewer.email}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}
