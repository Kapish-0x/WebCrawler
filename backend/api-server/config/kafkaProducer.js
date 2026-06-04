import kafka from "./kafka.js";

const producer = kafka.producer();

// Connect the producer once when the server starts up
export const initProducer = async () => {
  try {
    await producer.connect();
    console.log("⚡ Kafka Producer initialized and ready!");
  } catch (error) {
    console.error("❌ Failed to connect Kafka Producer:", error);
  }
};

/**
 * Sends a crawl command payload to Kafka for the Python workers to pick up
 */
export const sendCrawlCommand = async (jobId, seedUrl, maxPages) => {
  try {
    await producer.send({
      topic: "crawl-commands",
      messages: [
        {
          key: jobId, // Keeping keys consistent ensures the same job goes to the same partition
          value: JSON.stringify({
            jobId,
            seedUrl,
            maxPages,
            timestamp: new Date()
          }),
        },
      ],
    });
    console.log(`📤 Crawl command dispatched for Job ID: ${jobId}`);
  } catch (error) {
    console.error("❌ Error dispatching Kafka crawl command:", error);
    throw error;
  }
};