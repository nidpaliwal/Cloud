import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createFormatVariants } from '../services/generation.js';

const router = Router();

router.post(
  '/',
  [
    body('publicId').isString().notEmpty(),
    body('aspectRatio').isString().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { publicId, aspectRatio } = req.body;
      
      const result = await createFormatVariants(publicId, aspectRatio);
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Transform error:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Transform failed' 
      });
    }
  }
);

export default router;