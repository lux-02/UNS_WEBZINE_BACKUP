import { NextRequest, NextResponse } from "next/server";
import { updateEventBySlug, deleteEventBySlug } from "@/lib/api/events";

// PUT /api/events/[id] - Update event by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // This is actually the slug
    const body = await request.json();

    // Get locale from query params or default to 'ko'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ko";

    const event = await updateEventBySlug(id, body, locale);

    if (!event) {
      return NextResponse.json(
        { error: "Failed to update event", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: event, success: true });
  } catch (error) {
    console.error("Error in PUT /api/events/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update event";
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // This is actually the slug

    // Get locale from query params or default to 'ko'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ko";

    const success = await deleteEventBySlug(id, locale);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete event", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete event", success: false },
      { status: 500 }
    );
  }
}
