import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import uploadRoutes from './routes/upload.js';
import generateRoutes from './routes/generate.js';
import transformRoutes from './routes/transform.js';
import assetRoutes from './routes/asset.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 3001;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/upload', uploadRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/transform', transformRoutes);
app.use('/api/asset', assetRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
//# sourceMappingURL=index.js.map