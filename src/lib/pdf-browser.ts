import type { Browser } from "puppeteer-core"

export async function launchPdfBrowser(): Promise<Browser> {
  const localChromePath =
    process.env.CHROME_PATH ||
    (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "")

  if (localChromePath) {
    try {
      const { default: puppeteer } = await import("puppeteer-core")
      return await puppeteer.launch({ executablePath: localChromePath, headless: true })
    } catch {
      // Fall through to the serverless Chromium build below.
    }
  }

  const chromiumMod = await import("@sparticuz/chromium")
  const chromium = (chromiumMod as unknown as { default?: typeof chromiumMod }).default ?? chromiumMod
  const { default: puppeteer } = await import("puppeteer-core")

  return await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
  })
}