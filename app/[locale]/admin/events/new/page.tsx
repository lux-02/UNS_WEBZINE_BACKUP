"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { motion } from "framer-motion";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    content: "",
    tags: "",
    published: false,
    locale: "ko",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (content: string) => {
    // Extract description from content (first 100 characters of plain text)
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const trimmedText = plainText.substring(0, 100).trim();
    // Add "..." if text was truncated
    const description =
      plainText.length > 100 ? `${trimmedText}...` : trimmedText;

    // Extract hashtags from content
    const hashtagRegex = /#[\wㄱ-ㅎㅏ-ㅣ가-힣]+/g;
    const matches = content.match(hashtagRegex);
    const tags = matches
      ? [...new Set(matches.map((tag) => tag.substring(1)))].join(", ") // Remove # and join
      : "";

    setFormData((prev) => ({
      ...prev,
      content,
      description,
      tags,
    }));
  };

  const generateSlug = () => {
    // Remove Korean characters and only keep English letters, numbers
    const baseSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Remove non-alphanumeric characters (including Korean)
      .replace(/(^-|-$)/g, "") // Remove leading/trailing hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

    // Generate a unique random string (6 characters)
    const randomStr = Math.random().toString(36).substring(2, 8);

    // If slug is empty (e.g., only Korean title), use event prefix
    const finalSlug = baseSlug
      ? `${baseSlug}-${randomStr}`
      : `event-${randomStr}`;

    setFormData((prev) => ({ ...prev, slug: finalSlug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to create event");
      }

      const data = await response.json();
      router.push(`/events/${data.data.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert(
        `Failed to create event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                onBlur={generateSlug}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter event title"
              />
            </div>

            {/* Slug - Hidden, auto-generated */}
            <input type="hidden" name="slug" value={formData.slug} />

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Description - Hidden, auto-generated from content */}
            <input
              type="hidden"
              name="description"
              value={formData.description}
            />

            {/* Tags - Hidden, auto-extracted from content hashtags */}
            <input type="hidden" name="tags" value={formData.tags} />

            {/* Auto-generated info display */}
            {(formData.description || formData.tags) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Auto-generated Information
                </h3>
                {formData.description && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Description:
                    </span>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      {formData.description}
                    </p>
                  </div>
                )}
                {formData.tags && (
                  <div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Tags:
                    </span>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      {formData.tags}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Locale */}
            <div>
              <label
                htmlFor="locale"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Language *
              </label>
              <select
                id="locale"
                name="locale"
                required
                value={formData.locale}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>

            {/* Published */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="published"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Publish immediately
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
