"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Link2, ImageIcon, X } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

type LibraryFile = { url: string; name: string; size: number; uploadedAt: string }

export function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url" | "library">(value ? "url" : "upload")
  const [uploading, setUploading] = useState(false)
  const [library, setLibrary] = useState<LibraryFile[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === "library" && library.length === 0 && !loadingLibrary) {
      setLoadingLibrary(true)
      fetch("/api/uploads")
        .then((r) => r.ok ? r.json() : [])
        .then((data) => setLibrary(data ?? []))
        .catch(() => {})
        .finally(() => setLoadingLibrary(false))
    }
  }, [mode, library.length, loadingLibrary])

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      onChange(data.url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`text-xs px-2 py-0.5 rounded ${mode === "upload" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-fg"}`}
          >
            <Upload size={12} className="inline mr-1" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`text-xs px-2 py-0.5 rounded ${mode === "url" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-fg"}`}
          >
            <Link2 size={12} className="inline mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("library")}
            className={`text-xs px-2 py-0.5 rounded ${mode === "library" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-fg"}`}
          >
            <ImageIcon size={12} className="inline mr-1" />
            Library
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload size={20} className="text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Click or drag to upload</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP (max 5MB)</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : mode === "url" ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div className="rounded-lg border border-border p-2">
          {loadingLibrary ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : library.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No uploaded images found.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {library.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => { onChange(f.url); setMode("upload") }}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    value === f.url ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${f.url})` }}
                  />
                  {value === f.url && (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative mt-1">
          <div
            className="h-24 w-full rounded-lg bg-cover bg-center border border-border"
            style={{ backgroundImage: `url(${value})` }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
          >
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  )
}
