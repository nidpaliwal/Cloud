# AI Product Studio

Transform a single product image into multiple professional marketing assets using Cloudinary AI.

## Features

- 📸 **Drag & Drop Upload** - Easy product image upload with validation
- 🎨 **AI Scene Generation** - Place products in any environment (outdoor, studio, lifestyle, etc.)
- 🎯 **Marketing Purpose** - Optimize for e-commerce, social media, ads, stories, banners
- ✨ **Visual Styles** - Professional, vibrant, moody, clean, warm, cool, vintage, luxury
- 🔄 **Multiple Variations** - Generate 1-8 unique variations per request
- 📱 **Format Variants** - Auto-create aspect ratios (1:1, 9:16, 16:9, 4:5)
- ⚡ **Auto Optimization** - Cloudinary f_auto, q_auto for optimal delivery
- 📥 **Download & Share** - Direct downloads and shareable Cloudinary URLs
- 🔍 **Before/After Comparison** - Visual comparison slider

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Media/AI | Cloudinary (Upload, Generative Fill, Transform, Optimize, CDN) |
| Dev | Docker, Docker Compose |

## Prerequisites

- Node.js 18+
- Cloudinary account (free tier works)
- Docker (optional, for containerized deployment)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd ai-product-studio
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these from [Cloudinary Console](https://console.cloudinary.com/settings/c-<cloud_name>/security/api-keys).

### 3. Run Development

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

Or run both together:
```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3001

### 4. Docker Development

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Cloudinary AI Features Used

| Feature | Implementation |
|---------|----------------|
| **Generative Fill** | `e_gen_fill:prompt_<prompt>` - Replace backgrounds with AI scenes |
| **Generative Replace** | `e_gen_replace:from_<obj>;to_<obj>` - Swap specific elements |
| **Generative Restore** | `e_gen_restore` - Enhance image quality |
| **AI Vision** | Auto-detect product type for smart prompting |
| **Transformations** | Aspect ratio, crop, resize, format conversion |
| **Optimization** | `f_auto,q_auto` - Auto format (WebP/AVIF) + quality |
| **CDN Delivery** | Global fast delivery via Cloudinary URLs |

## Project Structure

```
ai-product-studio/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── services/         # Cloudinary, AI generation
│   │   ├── middleware/       # Error handling
│   │   └── config/           # Configuration
│   └── Dockerfile
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload product image to Cloudinary |
| POST | `/api/generate` | Start AI generation job |
| GET | `/api/generate/:jobId/status` | Poll generation status |
| POST | `/api/transform` | Create format variants |
| GET | `/api/asset/:publicId` | Get asset info |
| DELETE | `/api/asset/:publicId` | Delete asset |

## Generation Flow

```
1. Upload Image → Cloudinary Storage
2. User selects: Scene, Purpose, Style, Count
3. Backend builds prompts → Cloudinary Generative Fill
4. Multiple variations generated in parallel
5. Assets transformed & optimized
6. Gallery displays results with download/share
```

## Deployment

### Production (Docker)

```bash
docker-compose up --build -d
```

### Vercel (Frontend) + Railway/Render (Backend)

1. Push to GitHub
2. Connect frontend to Vercel
3. Connect backend to Railway/Render
4. Add environment variables
5. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `PORT` | Backend port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `VITE_API_URL` | Backend URL for frontend | No |
| `VITE_CLOUDINARY_CLOUD_NAME` | For frontend direct URLs | No |

## License

MIT - Built for Cloudinary AI Hackathon 2026 Track 2