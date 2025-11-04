"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function StoryPage() {
  const t = useTranslations("story");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl sm:text-2xl text-blue-50">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto space-y-16"
        >
          {/* Our Vision */}
          <motion.div variants={textVariants} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("vision.title")}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("vision.description1")}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("vision.description2")}
            </p>
          </motion.div>

          {/* Core Values */}
          <motion.div variants={textVariants} className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("values.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: t("values.globalYouth.title"),
                  description: t("values.globalYouth.description"),
                },
                {
                  title: t("values.peacefulDialogue.title"),
                  description: t("values.peacefulDialogue.description"),
                },
                {
                  title: t("values.dynamicAction.title"),
                  description: t("values.dynamicAction.description"),
                },
                {
                  title: t("values.inclusiveCommunity.title"),
                  description: t("values.inclusiveCommunity.description"),
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={textVariants}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-blue-900 border border-blue-100 dark:border-blue-800"
                >
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div variants={textVariants} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("mission.title")}
            </h2>
            <div className="space-y-4">
              {[
                t("mission.item1"),
                t("mission.item2"),
                t("mission.item3"),
                t("mission.item4"),
              ].map((mission, index) => (
                <motion.div
                  key={index}
                  variants={textVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 pt-1">
                    {mission}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partners Section */}
          <motion.div variants={textVariants} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("partners.title")}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("partners.description")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
              {/* Placeholder for partner logos */}
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  <span className="text-gray-400 dark:text-gray-600 text-sm">
                    Partner Logo
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={textVariants}
            className="text-center py-12 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-blue-50 mb-8">{t("cta.description")}</p>
            <a
              href="/timeline"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("cta.viewTimeline")}
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
