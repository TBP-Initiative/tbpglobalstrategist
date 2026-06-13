"use client"

import { useRef, useCallback } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = "120px" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    editorRef.current?.focus()
  }, [onChange])

  const handleInsertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) exec("createLink", url)
  }, [exec])

  const handleInsertImage = useCallback(() => {
    const url = prompt("Enter image URL:")
    if (url) {
      exec("insertImage", url)
    }
  }, [exec])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (!res.ok) { alert("Upload failed"); return }
    const data = await res.json()
    exec("insertImage", data.url)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [exec])

  const insertHtmlAtCursor = useCallback((html: string) => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const fragment = range.createContextualFragment(html)
    range.insertNode(fragment)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInsertVideo = useCallback(() => {
    const url = prompt("Enter video URL (YouTube, Vimeo, or direct video link):")
    if (!url) return
    let embedHtml = ""
    const trimmed = url.trim()

    const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    if (ytMatch) {
      embedHtml = `<div class="aspect-video my-4"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:8px"></iframe></div>`
    }

    const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      embedHtml = `<div class="aspect-video my-4"><iframe width="100%" height="100%" src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="border-radius:8px"></iframe></div>`
    }

    if (!embedHtml) {
      embedHtml = `<div class="my-4"><video src="${trimmed}" controls style="max-width:100%;border-radius:8px"></video></div>`
    }

    insertHtmlAtCursor(embedHtml)
  }, [insertHtmlAtCursor])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const sel = window.getSelection()
      if (!sel || !sel.rangeCount) return
      const range = sel.getRangeAt(0)
      const p = document.createElement("p")
      p.appendChild(document.createElement("br"))
      range.deleteContents()
      range.insertNode(p)
      const newRange = document.createRange()
      newRange.setStart(p.firstChild!, 0)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }, [onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  return (
    <div className="rounded-lg border border-input overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/30 px-1.5 py-1">
        <button type="button" onClick={() => exec("bold")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs font-bold" title="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => exec("italic")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs italic" title="Italic"><em>I</em></button>
        <button type="button" onClick={() => exec("underline")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs underline" title="Underline"><u>U</u></button>
        <span className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={() => exec("justifyLeft")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Align left">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M1 5h6M1 8h8M1 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>
        <button type="button" onClick={() => exec("justifyCenter")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 5h6M2 8h8M4 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>
        <button type="button" onClick={() => exec("justifyRight")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Align right">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M5 5h6M3 8h8M7 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>
        <button type="button" onClick={() => exec("justifyFull")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Justify">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M1 5h10M1 8h10M1 11h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>
        <span className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={() => exec("insertUnorderedList")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Bullet list">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="2" cy="3" r="1" fill="currentColor"/><path d="M5 3h6M5 6h6M5 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="2" cy="6" r="1" fill="currentColor"/><circle cx="2" cy="9" r="1" fill="currentColor"/></svg>
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Numbered list">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2h8M2 5h8M2 8h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M1 1.5v3M.5 8h1v1.5H.5V10h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={handleInsertLink} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Insert link">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.5 6.5a2.5 2.5 0 003.5 0l2-2a2.5 2.5 0 00-3.5-3.5l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 5.5a2.5 2.5 0 00-3.5 0l-2 2a2.5 2.5 0 003.5 3.5l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={handleInsertImage} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Insert image URL">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="4" cy="5" r="1" fill="currentColor"/><path d="M1 9l3-3 2 2 2-2 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <label className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs cursor-pointer" title="Upload image">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
        <span className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={handleInsertVideo} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-xs" title="Embed video">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><polygon points="5,4.5 5,7.5 8,6" fill="currentColor"/></svg>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) {
            const editor = editorRef.current
            const bareDivs = editor.querySelectorAll(":scope > div:not([class])")
            bareDivs.forEach((div) => {
              const p = document.createElement("p")
              while (div.firstChild) p.appendChild(div.firstChild)
              div.replaceWith(p)
            })
            onChange(editor.innerHTML)
          }
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        className="px-3 py-2 text-sm text-fg focus:outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        data-placeholder={placeholder ?? "Write something..."}
        style={{ minHeight }}
      />
    </div>
  )
}
