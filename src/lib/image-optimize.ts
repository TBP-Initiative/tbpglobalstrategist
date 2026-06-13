export interface OptimizedImage {
  dataUrl: string
  width: number
  height: number
  size: number
  format: string
}

const MAX_DIMENSION = 400
const QUALITY = 0.8

export function optimizeImage(file: File): Promise<OptimizedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)
        const mimeType = "image/webp"
        const dataUrl = canvas.toDataURL(mimeType, QUALITY)
        const base64 = dataUrl.split(",")[1]
        const size = Math.round((base64.length * 3) / 4)
        resolve({ dataUrl, width, height, size, format: "webp" })
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}
