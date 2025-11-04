import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/api/events';

// GET /api/events/slug/[slug] - Get event by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'ko';

    const event = await getEventBySlug(slug, locale);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: event, success: true });
  } catch (error) {
    console.error('Error in GET /api/events/slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', success: false },
      { status: 500 }
    );
  }
}
