import puppeteer from "puppeteer";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 KarirKitBot/1.0";

const NAV_TIMEOUT = parseInt(process.env.NAV_TIMEOUT ?? "90000", 10);
const WAIT_SELECTOR_TIMEOUT = parseInt(
  process.env.WAIT_SELECTOR_TIMEOUT ?? "20000",
  10
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

function getKnownSelectors(host) {
  const rules = [
    {
      test: /indeed\./i,
      selectors: ["#jobDescriptionText", ".jobsearch-jobDescriptionText"],
    },
    {
      test: /linkedin\./i,
      selectors: [
        ".show-more-less-html__markup",
        ".jobs-description__container",
      ],
    },
    {
      test: /(jobstreet|seek)\./i,
      selectors: ['[data-automation="jobAdDetails"]', ".job-description"],
    },
    { test: /glassdoor\./i, selectors: [".jobDescriptionContent"] },
    {
      test: /kalibrr\./i,
      selectors: [".k-text-original", "[data-automation='jobDesc']"],
    },
  ];
  for (const r of rules) if (r.test.test(host)) return r.selectors;
  return [];
}

export async function scrapeJob(url) {
  const target = normalizeUrl(url);
  const u = new URL(target);

  const launchOptions = {
    headless: process.env.PUPPETEER_HEADLESS ?? "new", // set "false" untuk debug GUI
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // Hemat bandwidth: jangan blokir stylesheet agar layout tetap render
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["image", "media", "font"].includes(type)) req.abort();
    else req.continue();
  });

  await page.setUserAgent(UA);
  await page.setExtraHTTPHeaders({
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  });
  await page.setViewport({ width: 1280, height: 800 });
  page.setDefaultNavigationTimeout(NAV_TIMEOUT);

  async function navigateWithRetries(page, target) {
    const profiles = [
      { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT },
      { waitUntil: "load", timeout: NAV_TIMEOUT },
      { waitUntil: "networkidle2", timeout: NAV_TIMEOUT },
    ];
    let lastErr;
    for (const p of profiles) {
      try {
        await page.goto(target, p);
        return;
      } catch (err) {
        lastErr = err;
        if (!(err instanceof Error) || !/timeout/i.test(String(err.message))) {
          throw err;
        }
      }
    }
    throw lastErr;
  }

  try {
    await navigateWithRetries(page, target);

    const knownSelectors = getKnownSelectors(u.host);
    const genericSelectors = [
      "article",
      "main",
      "[role='main']",
      ".content",
      "#content",
      ".jobsearch-JobComponent",
    ];
    const selectors = [...knownSelectors, ...genericSelectors];

    // Tunggu salah satu selector muncul (kalau ada)
    if (selectors.length) {
      try {
        await page.waitForSelector(selectors.join(", "), {
          timeout: WAIT_SELECTOR_TIMEOUT,
        });
      } catch {
        // lanjut saja, evaluator fallback akan mencoba gabungan paragraf
      }
    }

    // Sedikit delay agar konten SPA merender
    await sleep(800);

    const data = await page.evaluate((selectors) => {
      function pickText(el) {
        if (!el) return null;
        const t = el.innerText?.trim() || "";
        const html = el.innerHTML || "";
        return { text: t, html };
      }

      const title =
        document.querySelector("h1")?.innerText?.trim() ||
        document
          .querySelector("[class*='JobInfoHeader-title'] span")
          ?.textContent?.trim() ||
        document.title?.trim() ||
        null;

      const company =
        document
          .querySelector(
            "[data-company], .company, .topcard__org-name-link, [class*='AboutCompanySectionsc__Title'], [class*='company-name'], [data-automation*='advertiser-name']"
          )
          ?.textContent?.trim() ||
        document
          .querySelector("a[href*='company'], a[href*='companies']")
          ?.textContent?.trim() ||
        null;

      let found = null;
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        const picked = pickText(el);
        if (picked && picked.text && picked.text.length > 120) {
          found = { selector: sel, ...picked };
          break;
        }
      }

      if (!found) {
        const paras = Array.from(document.querySelectorAll("p, li"))
          .map((n) => n.textContent?.trim() || "")
          .filter(Boolean)
          .join("\n");
        if (paras.length > 120) {
          found = { selector: "fallback:p,li", text: paras, html: "" };
        }
      }

      return {
        title,
        company,
        description: found?.text || null,
        descriptionHtml: found?.html || null,
        usedSelector: found?.selector || null,
      };
    }, selectors);

    return {
      url: target,
      source: u.host,
      ...data,
    };
  } finally {
    await browser.close();
  }
}
