import express from 'express';
// Import your Mongoose CrawlJob model here
import CrawlJob from '../models/CrawlJob.js'; 

const router = express.Router();

/**
 * @route   GET /api/jobs
 * @desc    Get all crawl jobs (Stops frontend 404 polling spam)
 */
router.get('/jobs', async (req, res) => {
  try {
    // Fetch recent jobs from MongoDB to display in the cluster pipeline UI
    const jobs = await CrawlJob.find().sort({ createdAt: -1 }).limit(10);
    
    // Return the array directly to the dashboard
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Error fetching cluster jobs list:', error.message);
    // Return an empty array placeholder on failure so the UI loop doesn't blow up
    return res.status(200).json([]);
  }
});

/**
 * @route   GET /api/jobs/:id
 * @desc    Get the live real-time progress of a specific crawl job
 */
router.get('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await CrawlJob.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Crawl job not found' });
    }

    // Returns status, starting url, and current document tallies
    return res.status(200).json({
      jobId: job._id,
      status: job.status, // e.g., 'pending', 'processing', 'completed'
      seedUrl: job.seedUrl,
      pagesCrawled: job.pagesCrawled || 0,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    });

  } catch (error) {
    console.error('❌ Error fetching job status:', error.message);
    return res.status(500).json({ error: 'Internal server error tracking job parameters' });
  }
});

export default router;