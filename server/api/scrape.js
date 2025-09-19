import express from "express";
import passport from "passport"
import { scrapeJob } from "../lib/puppeteer.js";

const scrapeRouter = express.Router();

scrapeRouter.post("/job", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const url = String(req.body?.url || "");
    if (!url) return res.status(400).json({ message: "url is required" });

    const result = await scrapeJob(url);
    if (!result.description) {
      return res.status(422).json({ message: "No description found", result });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || "Scrape failed" });
  }
});

export default scrapeRouter;
