import { get, post, put, del, getStrapiMediaUrl } from "../strapi";
import {
  StrapiEventsResponse,
  StrapiEventResponse,
  StrapiEvent,
} from "@/types/strapi";
import { Event } from "@/types";

// Transform Strapi v5 event to app Event type
export function transformStrapiEvent(strapiEvent: StrapiEvent): Event {
  return {
    id: strapiEvent.slug || `event-${strapiEvent.id}`,
    title: strapiEvent.title || "Untitled Event",
    date: strapiEvent.date || new Date().toISOString(),
    description: strapiEvent.description || "",
    thumbnail: strapiEvent.thumbnail
      ? getStrapiMediaUrl(strapiEvent.thumbnail.url)
      : "",
    category: "General", // category field removed from Strapi v5 schema
    tags: Array.isArray(strapiEvent.tags) ? strapiEvent.tags : [],
    images: Array.isArray(strapiEvent.images)
      ? strapiEvent.images.map((img) => getStrapiMediaUrl(img.url))
      : [],
    videos: strapiEvent.videos?.map((video) => video.url) || [],
    content: strapiEvent.content || "",
  };
}

// Get all events
export async function getEvents(locale: string = "ko"): Promise<Event[]> {
  try {
    const response = await get<StrapiEventsResponse>("/events", {
      locale,
      populate: "*",
      "filters[published][$eq]": true,
      "sort[0]": "date:desc",
    });

    return response.data.map(transformStrapiEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Get single event by slug
export async function getEventBySlug(
  slug: string,
  locale: string = "ko"
): Promise<Event | null> {
  try {
    const response = await get<StrapiEventsResponse>("/events", {
      locale,
      populate: "*",
      "filters[slug][$eq]": slug,
      "filters[published][$eq]": true,
    });

    if (response.data.length === 0) {
      return null;
    }

    return transformStrapiEvent(response.data[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

// Get events by tag
export async function getEventsByTag(
  tag: string,
  locale: string = "ko"
): Promise<Event[]> {
  try {
    const response = await get<StrapiEventsResponse>("/events", {
      locale,
      populate: "*",
      "filters[tags][$contains]": tag,
      "filters[published][$eq]": true,
      "sort[0]": "date:desc",
    });

    return response.data.map(transformStrapiEvent);
  } catch (error) {
    console.error("Error fetching events by tag:", error);
    return [];
  }
}

// Create new event (admin only)
export async function createEvent(
  eventData: Partial<StrapiEvent>
): Promise<Event | null> {
  try {
    console.log("Sending to Strapi:", JSON.stringify(eventData, null, 2));
    const response = await post<StrapiEventResponse>("/events", eventData);
    console.log("Strapi response:", JSON.stringify(response, null, 2));
    return transformStrapiEvent(response.data);
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    // Re-throw the error so it can be caught by the API route
    throw error;
  }
}

// Update event by slug (admin only)
export async function updateEventBySlug(
  slug: string,
  eventData: Partial<StrapiEvent>,
  locale: string = "ko"
): Promise<Event | null> {
  try {
    // First, get the event to find its documentId
    const getResponse = await get<StrapiEventsResponse>("/events", {
      locale,
      "filters[slug][$eq]": slug,
    });

    console.log("Found events:", getResponse.data.length);

    if (getResponse.data.length === 0) {
      throw new Error("Event not found");
    }

    const documentId = getResponse.data[0].documentId;
    console.log("Updating event with documentId:", documentId);

    // Remove fields that shouldn't be in update payload
    const {
      id,
      documentId: _,
      createdAt,
      updatedAt,
      publishedAt,
      locale: _locale,
      ...cleanedData
    } = eventData as any;

    console.log("Event data to update:", JSON.stringify(cleanedData, null, 2));

    // Update using documentId (Strapi v5) with locale query param
    // Note: The put() function will wrap this in { data: cleanedData } automatically
    const response = await put<StrapiEventResponse>(
      `/events/${documentId}?locale=${locale}`,
      cleanedData
    );

    console.log("Update response:", response);
    return transformStrapiEvent(response.data);
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    // Re-throw the error so we can see it in the API route
    throw error;
  }
}

// Update event by documentId (admin only)
export async function updateEvent(
  documentId: string,
  eventData: Partial<StrapiEvent>
): Promise<Event | null> {
  try {
    const response = await put<StrapiEventResponse>(
      `/events/${documentId}`,
      eventData
    );
    return transformStrapiEvent(response.data);
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
}

// Delete event (admin only)
export async function deleteEvent(id: number): Promise<boolean> {
  try {
    await del(`/events/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

// Upload media file
export async function uploadMedia(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          ...(process.env.STRAPI_API_TOKEN && {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error:", errorText);
      throw new Error("Upload failed");
    }

    const data = await response.json();
    const relativeUrl = data[0]?.url;
    if (!relativeUrl) return null;

    // Return full URL
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${relativeUrl}`;
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
}
