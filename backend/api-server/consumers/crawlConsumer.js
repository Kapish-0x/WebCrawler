import kafka from "../config/kafka.js";
import { indexWebPage } from "../utils/searchIndex.js";
import CrawlPage from "../models/CrawlPage.js"; 
import CrawlJob from "../models/CrawlJob.js";   

const consumer = kafka.consumer({ groupId: "crawler-group" });

export const startCrawlConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Kafka Consumer connected successfully!");

    await consumer.subscribe({ topic: "crawled-pages", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawData = message.value.toString();
          const parsedPayload = JSON.parse(rawData);

          // Destructure all fields provided by our updated Python worker
          const { pageId, jobId, url, domain, title, crawlStatus, depthLevel, rawContent } = parsedPayload;
          console.log(`📥 Processing stream for page: ${url}`);

          // 1. Safe Upsert: Satisfies required 'domain', 'url', and 'depthLevel' fields on creation
          await CrawlPage.findByIdAndUpdate(
            pageId, 
            { 
              $set: { crawlStatus: "indexed" },
              $setOnInsert: {
                jobId,
                url,
                domain,
                title: title || "Untitled Page",
                depthLevel: depthLevel || 1
              }
            },
            { 
              upsert: true, 
              new: true,
              runValidators: true // Ensures everything aligns with the schema rules safely
            }
          );

          // 2. Increment pagesCrawled count on the parent job tracking document
          await CrawlJob.findByIdAndUpdate(jobId, {
            $inc: { pagesCrawled: 1 }
          });

          // 3. Stream clean text directly into Elasticsearch for instant search indexing
          await indexWebPage(pageId, jobId, url, rawContent);
          
          console.log(`✅ Successfully processed and indexed page: ${url}`);

        } catch (parseErr) {
          console.error("❌ Error processing message payload:", parseErr.message);
        }
      },
    });
  } catch (error) {
    console.error("Failed to initialize Kafka Consumer Engine:", error);
  }
};