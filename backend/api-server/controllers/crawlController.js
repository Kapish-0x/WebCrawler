import CrawlJob from "../models/CrawlJob.js";
import { sendCrawlCommand } from "../config/kafkaProducer.js";

export const createCrawlJob = async (req, res) => {
  try {
    const { seedUrl, maxDepth = 3 } = req.body;

    // 1. Core Validation (Matches your schema requirement)
    if (!seedUrl) {
      return res.status(400).json({ success: false, message: "Seed URL is required." });
    }

    // 2. Initialize the Document using fields EXACTLY matching your schema
    const newJob = await CrawlJob.create({
      createdBy: req.user?.id || "65f1a2b3c4d5e6f7a8b9c0d9", // Fallback for Postman testing
      seedUrl,
      maxDepth,
      status: "pending",
      pagesDiscovered: 0,
      pagesCrawled: 0
    });

    // 3. Fire the command message into Kafka for the Python Worker
    // Note: We send maxDepth along so the scraper knows how deep to go!
    await sendCrawlCommand(newJob._id.toString(), seedUrl, maxDepth);

    // 4. Return immediate success response to Postman
    return res.status(201).json({
      success: true,
      message: "Crawl job successfully queued.",
      jobId: newJob._id
    });

  } catch (error) {
    console.error("❌ Error creating crawl job:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};