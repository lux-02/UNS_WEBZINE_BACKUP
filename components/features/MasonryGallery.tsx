"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface MasonryGalleryProps {
  images: string[];
}

export default function MasonryGallery({ images }: MasonryGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {images.map((image, index) => {
          // Randomly assign different heights for masonry effect
          const heights = [200, 250, 300, 350];
          const randomHeight = heights[index % heights.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ gridRowEnd: `span ${Math.ceil(randomHeight / 10)}` }}
              className="cursor-pointer group overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
              onClick={() => openLightbox(index)}
            >
              <div
                className="relative w-full h-full overflow-hidden group-hover:scale-105 transition-transform duration-300"
                style={{ minHeight: `${randomHeight}px` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}
