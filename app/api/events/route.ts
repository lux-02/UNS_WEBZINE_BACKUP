import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/api/events";

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get("locale") || "ko";

    const events = await getEvents(locale);

    return NextResponse.json({ data: events, success: true });
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", success: false },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await createEvent(body);

    if (!event) {
      console.error("createEvent returned null");
      return NextResponse.json(
        { error: "Failed to create event", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: event, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create event",
        success: false,
      },
      { status: 500 }
    );
  }
}
