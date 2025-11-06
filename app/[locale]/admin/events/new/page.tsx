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
    published: true, // Always published
    locale: "ko", // Fixed locale
    thumbnail: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);


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

    // Log to console instead of displaying in UI
    console.log("Auto-generated Information:", { description, tags });

    setFormData((prev) => ({
      ...prev,
      content,
      description,
      tags,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
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
      let thumbnailId = undefined;
      const thumbnailFile = (document.getElementById("thumbnail") as HTMLInputElement).files?.[0];

      if (thumbnailFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", thumbnailFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload thumbnail");
        }

        const uploadData = await uploadResponse.json();
        thumbnailId = uploadData.id; // Use media ID for Strapi v5
      }

      const requestData: any = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((t) => t),
      };

      // Only include thumbnail if a file was uploaded
      if (thumbnailId) {
        requestData.thumbnail = thumbnailId;
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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

            {/* Thumbnail */}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Thumbnail Image
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {thumbnailPreview && (
                <div className="mt-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-w-xs rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Description - Hidden, auto-generated from content */}
            <input
              type="hidden"
              name="description"
              value={formData.description}
            />

            {/* Tags - Hidden, auto-extracted from content hashtags */}
            <input type="hidden" name="tags" value={formData.tags} />

            {/* Locale - Hidden, fixed to 'ko' */}
            <input type="hidden" name="locale" value={formData.locale} />

            {/* Published - Hidden, always true */}
            <input type="hidden" name="published" value="true" />

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
