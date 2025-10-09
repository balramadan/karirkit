import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { executablePath } from "puppeteer";

// Konfigurasi selector spesifik untuk setiap situs
const siteConfigs = {
  "www.linkedin.com": {
    title: ".top-card-layout__title",
    company: ".topcard__org-name-link",
    description: ".show-more-less-html__markup",
  },
  "glints.com": {
    title: "h1.career-title",
    company: ".career-company-name a",
    description: 'div[data-cy="job-description"]',
  },
  "www.jobstreet.co.id": {
    title: 'h1[data-automation="job-title"]',
    company: 'span[data-automation="company-name"]',
    description: 'div[data-automation="job-details-job-description"]',
  },
  "glassdoor.com": {
    title: 'h1[aria-live="polite"]',
    company: 'h4[aria-live="polite"]',
    description: '.jobDescriptionContent'
  }
  // Tambahkan situs lain di sini...
};

// Selector generik sebagai fallback
const genericDescriptionSelectors = [
  "#job-details", ".job-details", ".job-description", "#description", ".description",
];

export async function scrapeJob(url) {
  let browser = null;
  try {
    // Cek apakah kita berada di lingkungan Vercel
    const isProduction = !!process.env.VERCEL;

    let launchOptions = {
      ignoreHTTPSErrors: true,
    };

    if (isProduction) {
      // Konfigurasi untuk Vercel (Produksi)
      launchOptions.args = chromium.args;
      launchOptions.defaultViewport = chromium.defaultViewport;
      launchOptions.executablePath = await chromium.executablePath();
      launchOptions.headless = chromium.headless;
    } else {
      // Konfigurasi untuk Lokal (Development)
      // Secara eksplisit beritahu puppeteer-core di mana menemukan browser
      launchOptions.executablePath = executablePath();
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded", // Lebih andal untuk situs kompleks
      timeout: 60000, // Naikkan timeout menjadi 60 detik
    });

    const hostname = new URL(url).hostname;
    const config = siteConfigs[hostname];

    let result = {
      url,
      source: hostname,
      title: null,
      company: null,
      description: null,
      descriptionHtml: null,
      usedSelector: null,
    };
    
    // Fungsi helper untuk mengekstrak teks dari selector
    const getText = async (selector) => {
      try {
        return await page.$eval(selector, (el) => el.textContent.trim());
      } catch {
        return null;
      }
    };

    if (config) {
      // Gunakan konfigurasi spesifik jika ada
      result.title = await getText(config.title);
      result.company = await getText(config.company);
      const descElement = await page.$(config.description);
      if (descElement) {
        result.description = await descElement.evaluate(el => el.innerText);
        result.descriptionHtml = await descElement.evaluate(el => el.innerHTML);
        result.usedSelector = config.description;
      }
    }
    
    // Fallback jika metode spesifik gagal atau tidak ada
    if (!result.title) result.title = await page.title();
    if (!result.description) {
      for (const selector of genericDescriptionSelectors) {
        const element = await page.$(selector);
        if (element) {
          result.description = await element.evaluate((el) => el.innerText);
          result.descriptionHtml = await element.evaluate((el) => el.innerHTML);
          result.usedSelector = selector;
          break; // Hentikan loop jika selector ditemukan
        }
      }
    }

    return result;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw new Error(`Failed to scrape job from ${url}. Reason: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}