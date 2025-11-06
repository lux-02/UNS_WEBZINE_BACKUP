import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/api/events';

// POST /api/upload - Upload media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', success: false },
        { status: 400 }
      );
    }

    const result = await uploadMedia(file);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to upload file', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url, id: result.id, success: true });
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', success: false },
      { status: 500 }
    );
  }
}
