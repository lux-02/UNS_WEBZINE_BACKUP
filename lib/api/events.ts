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
    console.log("getEvents called for locale:", locale);
    const response = await get<StrapiEventsResponse>("/events", {
      locale,
      populate: "*",
      "filters[published][$eq]": true,
      "sort[0]": "date:asc", // Sort by date ascending (oldest first)
    });

    console.log(`getEvents: Found ${response.data.length} events`);
    const events = response.data.map(transformStrapiEvent);

    // Log thumbnail info for debugging
    events.forEach(event => {
      if (event.id.includes('10-24')) {
        console.log(`Event ${event.id} thumbnail:`, event.thumbnail);
      }
    });

    return events;
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
    const response = await post<StrapiEventResponse>("/events", eventData);
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

    if (getResponse.data.length === 0) {
      throw new Error("Event not found");
    }

    const documentId = getResponse.data[0].documentId;

    // Remove fields that shouldn't be in update payload
    // Note: Keep thumbnail if it's a number (media ID), remove if it's a string (URL)
    const {
      id,
      documentId: _,
      createdAt,
      updatedAt,
      publishedAt,
      locale: _locale,
      slug: _slug,
      images: _images,
      videos: _videos,
      ...cleanedData
    } = eventData as any;

    console.log("Original eventData:", eventData);
    console.log("Cleaned data before thumbnail check:", cleanedData);

    // Remove thumbnail if it's a URL string, keep if it's a media ID (number)
    if (
      cleanedData.thumbnail &&
      typeof cleanedData.thumbnail === "string" &&
      cleanedData.thumbnail.startsWith("http")
    ) {
      console.log("Removing thumbnail URL from update:", cleanedData.thumbnail);
      delete cleanedData.thumbnail;
    } else if (cleanedData.thumbnail) {
      console.log("Keeping thumbnail ID for update:", cleanedData.thumbnail);
    }

    console.log("Cleaned data being sent to Strapi:", JSON.stringify(cleanedData, null, 2));

    // Update using documentId (Strapi v5) with locale and populate params
    // Note: The put() function will wrap this in { data: cleanedData } automatically
    const response = await put<StrapiEventResponse>(
      `/events/${documentId}?locale=${locale}&populate=*`,
      cleanedData
    );

    console.log("Strapi update response:", response);
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

// Delete event by slug (admin only)
export async function deleteEventBySlug(
  slug: string,
  locale: string = "ko"
): Promise<boolean> {
  try {
    // First, get the event to find its documentId
    const getResponse = await get<StrapiEventsResponse>("/events", {
      locale,
      "filters[slug][$eq]": slug,
    });

    if (getResponse.data.length === 0) {
      throw new Error("Event not found");
    }

    const documentId = getResponse.data[0].documentId;

    // Delete using documentId
    await del(`/events/${documentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

// Delete event by ID (admin only) - Legacy function
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
export async function uploadMedia(
  file: File
): Promise<{ url: string; id: number } | null> {
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
    const mediaId = data[0]?.id;
    const relativeUrl = data[0]?.url;
    if (!relativeUrl || !mediaId) return null;

    // Return both full URL and media ID
    return {
      url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${relativeUrl}`,
      id: mediaId,
    };
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
}
