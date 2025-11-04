"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MasonryGallery from "@/components/features/MasonryGallery";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { Event } from "@/types";

interface EventDetailClientProps {
  event: Event;
  relatedEvents: Event[];
}

export default function EventDetailClient({
  event,
  relatedEvents,
}: EventDetailClientProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-500 to-cyan-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <Link
              href="/timeline"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Timeline
            </Link>

            <div className="text-sm text-blue-100 mb-4">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {event.title}
            </h1>

            <p className="text-xl text-blue-50 mb-6">{event.description}</p>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Event Content */}
            {event.content && (
              <div className="mb-16">
                <MarkdownContent content={event.content} />
              </div>
            )}

            {/* Videos Section */}
            {event.videos && event.videos.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.videos.map((video, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
                    >
                      <iframe
                        src={video}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Video ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {event.images && event.images.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Photo Gallery
                </h2>
                <MasonryGallery images={event.images} />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Navigation to other events */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore More Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {relatedEvents.map((relatedEvent) => (
              <Link
                key={relatedEvent.id}
                href={`/events/${relatedEvent.id}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                      {relatedEvent.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {relatedEvent.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
