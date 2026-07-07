import type { ReactNode } from "react"

export function formatBio(text: string): ReactNode[] {
  const blocks = text.split(/\n\n+/)
  const elements: ReactNode[] = []

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim()
    if (!block) continue

    const lines = block.split("\n")
    const bulletLines = lines.filter((l) => /^[-*]\s/.test(l.trim()))

    if (bulletLines.length === lines.length && bulletLines.length > 0) {
      elements.push(
        <ul key={i} className="list-disc pl-5 space-y-1">
          {lines.map((line, j) => (
            <li key={j}>{line.trim().replace(/^[-*]\s+/, "")}</li>
          ))}
        </ul>
      )
    } else {
      const paragraphs = block.split("\n").filter((l) => l.trim())
      elements.push(
        <p key={i} className="mb-3 last:mb-0">
          {paragraphs.map((p, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {p}
            </span>
          ))}
        </p>
      )
    }
  }

  return elements
}
