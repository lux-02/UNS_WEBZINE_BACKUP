# Deployment Guide

## Quick Start

The project is ready to deploy! Choose one of the following deployment options:

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- Built by the creators of Next.js
- Zero configuration needed
- Automatic HTTPS and CDN
- Free tier available
- Preview deployments for every push

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your site will be live in 1-2 minutes.

### Environment Variables on Vercel:
- Go to Project Settings → Environment Variables
- Add any variables from `.env.example` you need
- Redeploy for changes to take effect

---

## Option 2: Netlify

### Steps:

1. **Build Configuration**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Connect your GitHub repository
   - Netlify will auto-deploy on every push

---

## Option 3: Docker (Self-hosted)

### Create Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run:

```bash
docker build -t uns-digital-hub .
docker run -p 3000:3000 uns-digital-hub
```

---

## Option 4: Traditional VPS (Ubuntu/Debian)

### Prerequisites:
- Node.js 18+
- Nginx (for reverse proxy)
- PM2 (for process management)

### Setup:

1. **Install Dependencies**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   cd /var/www/uns-digital-hub
   npm install
   npm run build

   # Start with PM2
   pm2 start npm --name "uns-hub" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## CMS Integration

### For Contentful:

1. Create a Contentful account
2. Set up content models for Events
3. Add environment variables:
   ```env
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_token
   ```
4. Create API integration in `lib/contentful.ts`
5. Replace mock data with Contentful queries

### For Strapi:

1. Install Strapi:
   ```bash
   npx create-strapi-app@latest cms --quickstart
   ```
2. Create Event content type
3. Configure API endpoints
4. Add environment variables:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://your-strapi-url
   STRAPI_API_TOKEN=your_token
   ```
5. Create API integration in `lib/strapi.ts`

---

## Performance Tips

### Image Optimization
- Use WebP/AVIF formats
- Store images in CDN (Cloudinary, Vercel Blob, AWS S3)
- Implement next/image for all images

### Caching
- Enable ISR (Incremental Static Regeneration) for event pages
- Set appropriate cache headers

### Monitoring
- Set up error tracking (Sentry)
- Enable Web Vitals monitoring
- Use Vercel Analytics or Google Analytics

---

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `.next` folder and rebuild
- Check for TypeScript errors

### Images Not Loading
- Verify image paths are correct
- Configure `remotePatterns` in next.config.js
- Check file permissions on server

### Slow Performance
- Enable image optimization
- Implement proper caching
- Use CDN for static assets

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Backups
- Backup CMS data regularly
- Keep Git history clean
- Version control environment variables (encrypted)

---

## Support

For deployment issues:
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel support: [vercel.com/support](https://vercel.com/support)
- GitHub Issues (if open-sourced)

---

Built with ❤️ for Peace
