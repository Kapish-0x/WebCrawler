import express from 'express';
// ⚡ IMPORT CrawlJob model to update page tallies dynamically!
import CrawlJob from '../models/CrawlJob.js'; 

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Search through crawled pages indexed in Elasticsearch
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
    const targetUrl = `${esNode}/crawled_pages/_search`;

    const searchBody = {
      query: {
        match: {
          content: q 
        }
      },
      highlight: {
        fields: {
          content: {} 
        }
      }
    };

    const response = await fetch(targetUrl, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(searchBody)
    });

    const searchData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'Elasticsearch search failed',
        error: searchData
      });
    }

    const hits = searchData.hits?.hits || [];
    
    const results = hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      url: hit._source.url,
      jobId: hit._source.jobId,
      indexedAt: hit._source.indexedAt,
      snippets: hit.highlight?.content || [] 
    }));

    return res.status(200).json({
      totalResults: searchData.hits?.total?.value || 0,
      results
    });

  } catch (error) {
    console.error('❌ Error handling search route:', error.message);
    return res.status(500).json({ error: 'Internal server error during search optimization' });
  }
});


// ========================================================
// 🎯 THE MISSING BRIDGE ENDPOINT: SAVE DATA TO ELASTICSEARCH
// ========================================================
/**
 * @route   POST /api/pages/index
 * @desc    Receives scraped plain text from Python worker and indexes it into Elasticsearch
 */
router.post('/pages/index', async (req, res) => {
  try {
    const { jobId, url, content } = req.body;

    if (!url || !content) {
      return res.status(400).json({ error: 'URL and content are required parameters' });
    }

    const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
    
    // 1. Save data directly to Elasticsearch index 'crawled_pages'
    const targetUrl = `${esNode}/crawled_pages/_doc`;
    const documentBody = {
      jobId: jobId || "unassigned",
      url: url,
      content: content,
      indexedAt: new Date().toISOString()
    };

    const esResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentBody)
    });

    const esData = await esResponse.json();

    if (!esResponse.ok) {
      console.error("❌ Elasticsearch Index Error:", esData);
      return res.status(500).json({ error: 'Failed to feed data into Elasticsearch cluster' });
    }

    // 2. Increment pagesCrawled tracker tally in MongoDB so your dashboard metrics update live!
    if (jobId && jobId !== "unassigned") {
      await CrawlJob.findByIdAndUpdate(jobId, {
        $inc: { pagesCrawled: 1 },
        status: 'processing'
      });
    }

    console.log(`✅ Document Indexed Successfully: ${url}`);
    return res.status(200).json({ success: true, message: 'Page content indexed cleanly!' });

  } catch (error) {
    console.error('❌ Error in crawl callback route:', error.message);
    return res.status(500).json({ error: 'Internal server error handling document registration' });
  }
});

export default router;