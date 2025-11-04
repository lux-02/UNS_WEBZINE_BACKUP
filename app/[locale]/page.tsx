"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function Home() {
  const t = useTranslations("home");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background images - replace with your uploaded images
  const backgroundImages = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${backgroundImages[currentSlide]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </AnimatePresence>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <img
              src="/images/logo.png"
              alt="UNs Logo"
              className="h-24 sm:h-32 lg:h-40 w-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-white bg-clip-text text-transparent drop-shadow-lg"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-100 mb-12 max-w-2xl mx-auto drop-shadow-lg"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/story"
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("hero.discoverStory")}
            </Link>
            <Link
              href="/timeline"
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/30"
            >
              {t("hero.exploreActivities")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-blue-500 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-blue-500 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-8 rounded-xl bg-gradient-to-br from-gray-800 to-blue-900">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {t("stats.year")}
              </div>
              <div className="text-gray-300">{t("stats.yearSubtitle")}</div>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-gray-800 to-blue-900">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {t("stats.global")}
              </div>
              <div className="text-gray-300">{t("stats.globalSubtitle")}</div>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-gray-800 to-blue-900">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {t("stats.together")}
              </div>
              <div className="text-gray-300">{t("stats.togetherSubtitle")}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <Link
            href="/timeline"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {t("cta.viewTimeline")}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
