"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { motion } from "framer-motion";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    published: false,
    locale: "ko",
  });

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/slug/${eventId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        alert("Event not found");
        router.push("/admin/events");
        return;
      }

      const event = data.data;
      setFormData({
        title: event.title || "",
        slug: event.id || "",
        date: event.date || "",
        description: event.description || "",
        content: event.content || "",
        category: event.category || "General",
        tags: Array.isArray(event.tags) ? event.tags.join(", ") : "",
        published: true, // Assuming published if we can fetch it
        locale: "ko",
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      alert("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      // We need to get the numeric ID from Strapi for the update
      // For now, we'll use the slug to find it
      const getResponse = await fetch(`/api/events/slug/${eventId}`);
      const getData = await getResponse.json();

      if (!getData.success || !getData.data) {
        throw new Error("Event not found");
      }

      // Use our API route to update
      // Only send fields that exist in Strapi schema and are allowed to be updated
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        date: formData.date,
        description: formData.description,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((t) => t),
        // Don't send locale - it's handled via query params
        // Don't send published - Strapi handles this via publishedAt
      };

      // Add locale as query parameter
      const response = await fetch(
        `/api/events/${eventId}?locale=${formData.locale}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      alert("Event updated successfully!");
      router.push(`/events/${formData.slug}`);
    } catch (error) {
      console.error("Error updating event:", error);
      alert(error instanceof Error ? error.message : "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Edit Event
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
                      {formData.description} ...
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
                Published
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
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
