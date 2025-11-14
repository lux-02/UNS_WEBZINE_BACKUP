import Timeline from "@/components/features/Timeline";
import { mockEvents } from "@/lib/mockData";
import { getEvents } from "@/lib/api/events";
import { getTranslations } from "next-intl/server";

// Make this page dynamic to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("timeline");

  console.log("Timeline page rendering for locale:", locale);

  // Try to fetch events from Strapi, fallback to mock data if Strapi is not available
  let events = mockEvents;
  try {
    const strapiEvents = await getEvents(locale);
    if (strapiEvents.length > 0) {
      events = strapiEvents;
    }
  } catch (error) {
    console.log("Using mock data, Strapi not available:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-500 to-cyan-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <Timeline events={events} />
    </div>
  );
}
