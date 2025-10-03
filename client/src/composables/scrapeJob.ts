import { api } from "@/lib/axios";

export type ScrapeResult = {
  url: string;
  source: string;
  title: string | null;
  company: string | null;
  description: string | null;
  descriptionHtml: string | null;
  usedSelector: string | null;
};

/**
 * The `scrapeJob` function in TypeScript asynchronously scrapes job information from a specified URL
 * using an API endpoint.
 * @param {string} url - The `url` parameter is a string that represents the URL of the job posting
 * that you want to scrape for information.
 * @returns The `scrapeJob` function is returning the data obtained from scraping the job information
 * from the provided URL.
 */
export async function scrapeJob(url: string) {
  const { data } = await api.post<ScrapeResult>("/v1/scrape/job", { url });
  return data;
}