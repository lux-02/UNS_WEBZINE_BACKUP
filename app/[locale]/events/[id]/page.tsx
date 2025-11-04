import { getEventById, mockEvents } from "@/lib/mockData";
import { getEventBySlug, getEvents } from "@/lib/api/events";
import { notFound } from "next/navigation";
import EventDetailClient from "@/components/events/EventDetailClient";

interface EventPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id, locale } = await params;

  // Try to fetch from Strapi first, fallback to mock data
  let event = getEventById(id);
  try {
    const strapiEvent = await getEventBySlug(id, locale);
    if (strapiEvent) {
      event = strapiEvent;
    }
  } catch (error) {
    console.log('Using mock data for event, Strapi not available:', error);
  }

  if (!event) {
    notFound();
  }

  // Fetch related events
  let relatedEvents = mockEvents.filter((e) => e.id !== event!.id).slice(0, 3);
  try {
    const strapiEvents = await getEvents(locale);
    if (strapiEvents.length > 0) {
      relatedEvents = strapiEvents
        .filter((e) => e.id !== event!.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.log('Using mock data for related events');
  }

  return <EventDetailClient event={event} relatedEvents={relatedEvents} />;
}
