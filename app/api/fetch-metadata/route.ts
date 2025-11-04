import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required', success: false },
        { status: 400 }
      );
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetadataBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();

    // Extract metadata from HTML
    const metadata = {
      title: extractMeta(html, 'og:title') || extractTitle(html) || url,
      description: extractMeta(html, 'og:description') || extractMeta(html, 'description') || '',
      image: extractMeta(html, 'og:image') || '',
      url: url,
      favicon: extractFavicon(html, url),
    };

    return NextResponse.json({ data: metadata, success: true });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata', success: false },
      { status: 500 }
    );
  }
}

function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']og:${property.replace('og:', '')}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property.replace('og:', '')}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractFavicon(html: string, baseUrl: string): string {
  const patterns = [
    /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["']/i,
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']icon["']/i,
    /<link[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']*)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const favicon = match[1];
      if (favicon.startsWith('http')) {
        return favicon;
      }
      const url = new URL(baseUrl);
      return `${url.protocol}//${url.host}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
    }
  }

  // Default to /favicon.ico
  const url = new URL(baseUrl);
  return `${url.protocol}//${url.host}/favicon.ico`;
}
