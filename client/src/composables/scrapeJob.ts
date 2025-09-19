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

export async function scrapeJob(url: string) {
  const { data } = await api.post<ScrapeResult>("/api/scrape/job", { url });
  return data;
}