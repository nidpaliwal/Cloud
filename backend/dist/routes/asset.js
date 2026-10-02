import { Router } from 'express';
import { cloudinaryService } from '../services/cloudinary.js';
const router = Router();
router.get('/:publicId', async (req, res) => {
    try {
        const publicId = req.params.publicId;
        const result = await cloudinaryService.getAssetInfo(publicId);
        res.json({
            success: true,
            data: {
                publicId: result.public_id,
                url: result.secure_url,
                secureUrl: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                createdAt: result.created_at,
            },
        });
    }
    catch (error) {
        console.error('Get asset error:', error);
        res.status(404).json({
            success: false,
            error: 'Asset not found'
        });
    }
});
router.delete('/:publicId', async (req, res) => {
    try {
        const publicId = req.params.publicId;
        await cloudinaryService.deleteAsset(publicId);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Delete asset error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Delete failed'
        });
    }
});
export default router;
//# sourceMappingURL=asset.js.map