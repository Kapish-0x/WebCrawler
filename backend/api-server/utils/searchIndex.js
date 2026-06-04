import esClient from "../config/elastic.js";

/**
 * Indexes a crawled web page's text content into Elasticsearch
 * @param {string} pageId - The MongoDB document ID for the page
 * @param {string} jobId - The ID of the crawl job running this task
 * @param {string} url - The complete URL of the crawled page
 * @param {string} content - The raw, cleaned text content parsed by Python
 */
export const indexWebPage = async (pageId, jobId, url, content) => {
  try {
    await esClient.index({
      index: "crawled_pages", // The name of our Elasticsearch index (like a table)
      id: pageId,            // Tie the ES document directly to our Mongoose Page ID
      document: {
        jobId,
        url,
        content,
        indexedAt: new Date(),
      },
    });
    console.log(`🔍 Page indexed successfully into Elasticsearch: ${url}`);
  } catch (error) {
    console.error(`❌ Elasticsearch Indexing Error for ${url}:`, error.message);
  }
};