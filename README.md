# Shortly - Advanced URL Shortener

A modern, full-featured URL shortener built with Next.js 14, TypeScript, and SQLite. Transform long URLs into clean, shareable links with powerful analytics, custom aliases, and a beautiful responsive interface.

![Shortly URL Shortener](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

### Core Functionality
- **🔗 URL Shortening**: Convert long URLs into short, memorable links
- **📊 Analytics Dashboard**: Track clicks, view statistics, and monitor performance
- **🎯 Custom Aliases**: Create personalized short codes for your links
- **⏰ Expiration Dates**: Set automatic expiration for temporary links
- **📱 QR Code Generation**: Generate QR codes for easy mobile sharing
- **🔄 Bulk Operations**: Manage multiple URLs efficiently

### Technical Features
- **⚡ High Performance**: SQLite database with optimized queries and indexing
- **🛡️ Security**: Input validation, SQL injection protection, and rate limiting ready
- **📈 Scalable Architecture**: Modular design ready for production scaling
- **🎨 Modern UI**: Responsive design with smooth animations and micro-interactions
- **🔍 SEO Optimized**: Proper meta tags and structured data
- **♿ Accessibility**: WCAG compliant with keyboard navigation support

### Analytics & Insights
- **📊 Click Tracking**: Detailed click analytics with timestamps
- **🌍 Geographic Data**: IP-based location tracking (ready for integration)
- **📱 Device Analytics**: User agent and referrer tracking
- **📈 Daily Statistics**: 30-day click history and trends
- **📋 Export Data**: JSON API for data export and integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/shortly-url-shortener.git
   cd shortly-url-shortener
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Create data directory** (auto-created on first run)
   \`\`\`bash
   mkdir data
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

\`\`\`env
# Database Configuration
DATABASE_PATH=./data/urls.db

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Analytics
ENABLE_ANALYTICS=true
ENABLE_GEO_TRACKING=false

# Custom Domain (for production)
CUSTOM_DOMAIN=yourdomain.com
\`\`\`

## 📁 Project Structure

\`\`\`
shortly-url-shortener/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── shorten/             # URL shortening endpoint
│   │   ├── stats/[shortCode]/   # Analytics endpoint
│   │   ├── urls/                # URL management endpoints
│   │   └── health/              # Health check endpoint
│   ├── [shortCode]/             # Dynamic redirect pages
│   ├── dashboard/               # Analytics dashboard (future)
│   ├── globals.css              # Global styles and animations
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main landing page
├── components/                   # Reusable UI components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Core business logic
│   ├── database.ts              # SQLite database setup
│   ├── url-shortener.ts         # URL shortening logic
│   ├── analytics.ts             # Analytics utilities
│   └── utils.ts                 # Helper functions
├── data/                        # Database files (auto-created)
│   └── urls.db                  # SQLite database
├── public/                      # Static assets
├── types/                       # TypeScript type definitions
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
\`\`\`

## 🔧 API Documentation

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Endpoints

#### 1. Shorten URL
**POST** `/api/shorten`

Create a new short URL.

**Request Body:**
\`\`\`json
{
  "url": "https://example.com/very/long/url",
  "custom_alias": "my-link",        // Optional
  "expires_at": "2024-12-31T23:59:59Z"  // Optional
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "short_url": "abc123",
  "short_code": "abc123",
  "original_url": "https://example.com/very/long/url",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2024-12-31T23:59:59Z",
  "clicks": 0,
  "is_active": true
}
\`\`\`

#### 2. Get URL Statistics
**GET** `/api/stats/{shortCode}`

Retrieve detailed analytics for a short URL.

**Response:**
\`\`\`json
{
  "short_code": "abc123",
  "original_url": "https://example.com/very/long/url",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": null,
  "total_clicks": 42,
  "is_active": true,
  "recent_clicks": [
    {
      "id": 1,
      "clicked_at": "2024-01-15T11:00:00Z",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "referer": "https://twitter.com"
    }
  ],
  "daily_stats": [
    {
      "date": "2024-01-15",
      "clicks": 15
    }
  ]
}
\`\`\`

#### 3. List All URLs
**GET** `/api/urls?limit=50`

Retrieve a list of all shortened URLs.

**Query Parameters:**
- `limit` (optional): Number of URLs to return (default: 50)

#### 4. Delete URL
**DELETE** `/api/urls/{shortCode}`

Soft delete a shortened URL (deactivates it).

#### 5. Redirect
**GET** `/{shortCode}`

Redirects to the original URL and records analytics.

### Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

## 🗄️ Database Schema

### URLs Table
\`\`\`sql
CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1
);
\`\`\`

### Clicks Table
\`\`\`sql
CREATE TABLE clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT NOT NULL,
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  FOREIGN KEY (short_code) REFERENCES urls (short_code)
);
\`\`\`

### Indexes
- `idx_urls_short_code` - Fast short code lookups
- `idx_clicks_short_code` - Analytics queries
- `idx_clicks_clicked_at` - Time-based analytics

## 🎨 UI Components

### Landing Page
- **Hero Section**: Compelling headline and call-to-action
- **URL Input**: Clean form with validation and loading states
- **Results Display**: Shortened URL with copy and QR code options
- **Trust Indicators**: Company logos and testimonials

### Animations
- **Fade In**: Smooth page load animations
- **Slide Transitions**: Element entrance effects
- **Hover States**: Interactive button and link effects
- **Loading States**: Spinner and progress indicators
- **Success Feedback**: Copy confirmation and success states

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop**: Full-featured desktop interface
- **Large Screens**: Optimized for 4K displays

## 🔒 Security Features

### Input Validation
- URL format validation
- SQL injection prevention
- XSS protection
- CSRF protection (ready for implementation)

### Rate Limiting (Ready for Implementation)
\`\`\`typescript
// Example rate limiting setup
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP"
}
\`\`\`

### Data Protection
- No sensitive data logging
- Optional IP anonymization
- GDPR compliance ready
- Data retention policies

## 📊 Analytics Features

### Click Tracking
- **Real-time**: Immediate click recording
- **Detailed**: IP, user agent, referrer tracking
- **Geographic**: Country-level location data (ready)
- **Time-based**: Hourly and daily statistics

### Reporting
- **Daily Stats**: 30-day click history
- **Top Performers**: Most clicked URLs
- **Traffic Sources**: Referrer analysis
- **Device Types**: Mobile vs desktop usage

### Data Export
\`\`\`bash
# Export all data
curl http://localhost:3000/api/export

# Export specific URL stats
curl http://localhost:3000/api/stats/abc123
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Environment Variables**
   Set in Vercel dashboard or via CLI:
   \`\`\`bash
   vercel env add DATABASE_PATH
   vercel env add CUSTOM_DOMAIN
   \`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Traditional Hosting
1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

### Database Migration
For production, consider migrating to PostgreSQL:

\`\`\`typescript
// lib/database-postgres.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
\`\`\`

## 🔧 Configuration

### Custom Domain Setup
1. **Update environment variables**
   \`\`\`env
   CUSTOM_DOMAIN=short.yourdomain.com
   \`\`\`

2. **Configure DNS**
   \`\`\`
   CNAME short.yourdomain.com -> your-app.vercel.app
   \`\`\`

3. **Update short URL generation**
   \`\`\`typescript
   const shortUrl = `https://${process.env.CUSTOM_DOMAIN}/${shortCode}`
   \`\`\`

### Analytics Integration
\`\`\`typescript
// lib/analytics.ts
export const trackClick = async (shortCode: string, data: ClickData) => {
  // Google Analytics
  gtag('event', 'click', {
    short_code: shortCode,
    original_url: data.originalUrl
  })
  
  // Custom analytics
  await fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
\`\`\`

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm run test
\`\`\`

### API Testing
\`\`\`bash
# Test URL shortening
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Test redirect
curl -I http://localhost:3000/abc123

# Test analytics
curl http://localhost:3000/api/stats/abc123
\`\`\`

### Load Testing
\`\`\`bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3000/api/shorten
\`\`\`

## 📈 Performance Optimization

### Database Optimization
- **Indexes**: Optimized for common queries
- **Connection Pooling**: Ready for high traffic
- **Query Optimization**: Efficient SQL queries
- **Caching**: Redis integration ready

### Frontend Optimization
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Static Generation**: Pre-rendered pages
- **CDN Ready**: Vercel Edge Network

### Monitoring
\`\`\`typescript
// lib/monitoring.ts
export const logPerformance = (operation: string, duration: number) => {
  console.log(`${operation} took ${duration}ms`)
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Datadog, New Relic, etc.
  }
}
\`\`\`

## 🤝 Contributing

### Development Setup
1. **Fork the repository**
2. **Create feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make changes and test**
4. **Commit with conventional commits**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`
5. **Push and create PR**

### Code Style
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Conventional Commits**: Required for PRs

### Testing Requirements
- Unit tests for new features
- API endpoint testing
- UI component testing
- Performance impact assessment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment and hosting platform
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **SQLite** - Reliable embedded database

## 📞 Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and community support
- **Discord**: Real-time community chat (link in repo)

### Professional Support
For enterprise support and custom development:
- Email: support@shortly.dev
- Website: https://shortly.dev
- Documentation: https://docs.shortly.dev

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**

*Star ⭐ this repository if you find it helpful!*
