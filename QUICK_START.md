# Quick Start Guide

Welcome to the UNs Digital Hub! This guide will help you get started quickly.

## 🚀 Getting Started (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Visit [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

That's it! You should see the homepage.

---

## 📁 What's Built

### Pages Available:
- **Home** (`/`) - Landing page with hero section
- **UNs STORY** (`/story`) - About page with mission and values
- **Timeline** (`/timeline`) - All events in timeline format
- **Event Details** (`/events/[id]`) - Individual event pages with galleries

### Features:
- ✅ Dark/Light mode toggle
- ✅ Mobile responsive design
- ✅ Interactive animations
- ✅ Image galleries with lightbox
- ✅ Video embedding (YouTube)
- ✅ Tag-based filtering
- ✅ Accessibility compliant

---

## ✏️ Adding Your Content

### Step 1: Add Event Data

Edit `lib/mockData.ts` and add your events:

```typescript
{
  id: "your-event-slug",
  title: "Your Event Title",
  date: "2025-03-21",
  description: "Brief description of your event",
  thumbnail: "/images/events/your-thumb.jpg",
  category: "Festival", // or "Campaign", "Conference", etc.
  tags: ["Tag1", "Tag2"],
  images: [
    "/images/events/photo1.jpg",
    "/images/events/photo2.jpg",
  ],
  videos: ["https://www.youtube.com/embed/YOUR_VIDEO_ID"],
  content: `
# Your Event Details

Write your full event description here.
You can use markdown or HTML.

## Highlights
- Point 1
- Point 2
  `
}
```

### Step 2: Add Images

Place your images in the `public/images/` folder:
```
public/
  images/
    events/
      your-event-name/
        photo1.jpg
        photo2.jpg
        thumbnail.jpg
```

### Step 3: Update Story Page

Edit `app/story/page.tsx` to customize:
- Your mission statement
- Core values
- Partner logos

---

## 🎨 Customizing Design

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: "#0066E6", // Change your primary color
  },
  peace: {
    blue: "#0066E6",  // Customize peace theme colors
  }
}
```

### Fonts
Update in `app/layout.tsx` and `globals.css`

### Animations
Modify framer-motion configurations in component files

---

## 🎬 Embedding YouTube Videos

1. Get your YouTube video ID from the URL:
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Video ID is: `dQw4w9WgXcQ`

2. Add to event data:
   ```typescript
   videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"]
   ```

---

## 📱 Testing on Mobile

### Using Browser DevTools:
1. Open Chrome/Firefox DevTools (F12)
2. Click device toolbar icon
3. Select different device sizes

### On Real Device:
```bash
npm run dev
```
Then visit `http://YOUR_LOCAL_IP:3000` from your phone (must be on same network)

---

## 🚢 Ready to Deploy?

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Done! ✨

---

## 🔧 Common Tasks

### Build for Production
```bash
npm run build
npm start
```

### Check for Errors
```bash
npm run lint
```

### Update Dependencies
```bash
npm update
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Full README](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🆘 Need Help?

### Common Issues:

**Port already in use?**
```bash
# Next.js will automatically use next available port
# Or kill the process using port 3000:
lsof -ti:3000 | xargs kill
```

**Build errors?**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**TypeScript errors?**
- Check `tsconfig.json`
- Run `npm install` again
- Restart your editor

---

## 🎯 Next Steps

1. **Add Your Content**: Update events in `lib/mockData.ts`
2. **Add Images**: Place your photos in `public/images/`
3. **Customize Colors**: Edit `tailwind.config.ts`
4. **Test Everything**: Check all pages and features
5. **Deploy**: Follow `DEPLOYMENT.md` when ready

---

Happy Building! 🚀

*Built with ❤️ for Peace*
