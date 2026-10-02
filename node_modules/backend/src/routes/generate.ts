import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateAssets, buildVariationPrompts } from '../services/generation.js';

const router = Router();

const generationJobs = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  assets?: any[];
  error?: string;
}>();

router.post(
  '/',
  [
    body('publicId').isString().notEmpty(),
    body('scene').isString().notEmpty(),
    body('purpose').isString().notEmpty(),
    body('style').isString().notEmpty(),
    body('variations').isInt({ min: 1, max: 8 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { publicId, scene, purpose, style, variations } = req.body;
      const jobId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      generationJobs.set(jobId, {
        status: 'pending',
        progress: 0,
        message: 'Initializing generation...',
      });

      // Start async generation
      generateAsync(jobId, publicId, { scene, purpose, style }, variations);

      res.json({ success: true, data: { jobId } });
    } catch (error) {
      console.error('Generate error:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Generation failed' 
      });
    }
  }
);

router.get('/:jobId/status', (req: Request, res: Response) => {
  const job = generationJobs.get(req.params.jobId);
  
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  res.json({ success: true, data: job });
});

async function generateAsync(
  jobId: string,
  publicId: string,
  options: { scene: string; purpose: string; style: string },
  variations: number
) {
  const job = generationJobs.get(jobId);
  if (!job) return;

  try {
    job.status = 'processing';
    job.progress = 10;
    job.message = 'Building prompts...';
    generationJobs.set(jobId, job);

    // Simulate progress updates
    const updateProgress = (progress: number, message: string) => {
      job.progress = progress;
      job.message = message;
      generationJobs.set(jobId, job);
    };

    updateProgress(20, 'Sending to Cloudinary AI...');
    
    const assets = await generateAssets(publicId, options, variations);
    
    updateProgress(90, 'Processing results...');
    
    job.status = 'completed';
    job.progress = 100;
    job.message = 'Generation complete!';
    job.assets = assets;
    generationJobs.set(jobId, job);
  } catch (error) {
    job.status = 'failed';
    job.progress = 0;
    job.error = error instanceof Error ? error.message : 'Generation failed';
    generationJobs.set(jobId, job);
  }
}

export default router;