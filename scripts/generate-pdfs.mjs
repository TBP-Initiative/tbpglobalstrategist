import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const docs = [
  {
    html: path.join(__dirname, 'project-overview.html'),
    pdf: path.join(__dirname, '..', 'public', 'docs', 'TBP_Global_Strategist_Project_Overview.pdf'),
  },
  {
    html: path.join(__dirname, 'user-guide.html'),
    pdf: path.join(__dirname, '..', 'public', 'docs', 'TBP_Global_Strategist_User_Guide.pdf'),
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const doc of docs) {
  const page = await browser.newPage();
  const fs = await import('fs');
  const html = fs.readFileSync(doc.html, 'utf-8');
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: doc.pdf,
    format: 'A4',
    margin: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
    printBackground: true,
  });
  await page.close();
  console.log(`Generated: ${doc.pdf}`);
}

await browser.close();
