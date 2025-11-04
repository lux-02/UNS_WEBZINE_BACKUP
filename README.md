# Peace Connects Us: The 2025 UNs Digital Hub

Official archive and community platform for 2025 Busan UNs activities - documenting our journey towards peace and global understanding.

## Features

### Core Functionality

- **UNs STORY**: Immersive introduction to our mission, vision, and values with animated text reveals
- **Interactive Timeline**: Scroll-based timeline showcasing all activities with framer-motion animations
- **Event Pages**: Detailed event pages with:
  - Masonry-style photo galleries
  - YouTube video embedding
  - Tag-based navigation
  - Image lightbox with keyboard navigation
  - Download functionality
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Mobile-First Design**: Fully responsive across all devices
- **Accessibility**: WCAG 2.1 compliant with semantic HTML and keyboard navigation

### Technical Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Image Optimization** with next/image
- **SEO Optimized** with metadata and OpenGraph tags

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uns-digital-hub
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
uns-digital-hub/
├── app/                      # Next.js App Router pages
│   ├── events/[id]/         # Dynamic event pages
│   ├── story/               # UNs Story page
│   ├── timeline/            # Timeline page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── not-found.tsx        # 404 page
├── components/
│   ├── features/            # Feature components
│   │   ├── MasonryGallery.tsx
│   │   └── Timeline.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                  # UI components
│       └── ImageLightbox.tsx
├── lib/
│   └── mockData.ts          # Mock data (to be replaced with CMS)
├── types/
│   └── index.ts             # TypeScript type definitions
└── public/                  # Static assets
    ├── images/
    └── videos/
```

## Content Management

### Current Setup (Development)

The project currently uses mock data defined in `lib/mockData.ts` for development purposes.

### Production CMS Integration

For production, you can integrate either:

#### Option 1: Contentful (SaaS)
- Easy to set up and manage
- No hosting required
- Great for non-technical content editors

#### Option 2: Strapi (Self-hosted)
- Full control and customization
- Self-hosted solution
- More technical setup required

### Adding New Events

Currently, edit `lib/mockData.ts` to add new events. Once CMS is integrated, events can be managed through the CMS interface.

Example event structure:
```typescript
{
  id: "event-slug",
  title: "Event Title",
  date: "2025-03-21",
  description: "Event description",
  thumbnail: "/images/event-thumb.jpg",
  category: "Campaign",
  tags: ["Tag1", "Tag2"],
  images: ["/images/photo1.jpg", "/images/photo2.jpg"],
  videos: ["https://youtube.com/embed/VIDEO_ID"],
  content: "Markdown or HTML content"
}
```

## Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: {
    // Your color shades
  },
  peace: {
    blue: "#0066E6",
    sky: "#4D9CFF",
    // Add more custom colors
  },
}
```

### Animations

Animations are handled by framer-motion. Edit component files to customize animation behaviors.

### Typography

Font configuration is in `app/layout.tsx` and `globals.css`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Self-hosted with Docker

Build command: `npm run build`
Start command: `npm start`

## Environment Variables

Create a `.env.local` file for environment variables (if using CMS):

```env
# Contentful (if using)
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Strapi (if using)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token
```

## Performance Optimization

- Images are automatically optimized using next/image
- Static pages are pre-rendered at build time
- Animations use GPU acceleration
- Lazy loading for images and components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus visible indicators
- Alt text for images
- Sufficient color contrast

## Contributing

This is a private project for 2025 Busan UNs Supporters. For questions or contributions, please contact the development team.

## License

Copyright © 2025 Busan UNs Supporters. All rights reserved.

## Support

For technical issues or questions, please contact the development team.

---

Built with ❤️ by the 2025 UNs Team
