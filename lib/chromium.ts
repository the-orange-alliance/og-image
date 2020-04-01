import { launch } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
const chromePath = process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let page;

const getPage = async (isDev: boolean) => {
  if (page) return page;
  const devOptions = {
    args: [],
    executablePath: chromePath,
    headless: true
  }
  const prodOptions = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  }
  const options = isDev ? devOptions : prodOptions
  const browser = await launch(options);
  page = await browser.newPage();
  return page;
}

export const getScreenshot = async (html: string, isDev: boolean) => {
  const page = await getPage(isDev);
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(`data:text/html,${encodeURIComponent(html)}`, { waitUntil: 'networkidle0' });
  const file = await page.screenshot({ type: 'png' });
  return file;
}