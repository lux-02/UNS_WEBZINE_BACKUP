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
    thumbnail: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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
        thumbnail: event.thumbnail || "",
      });
      if (event.thumbnail) {
        setThumbnailPreview(event.thumbnail);
      }
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
      setThumbnailPreview(formData.thumbnail); // Revert to original if no file is selected
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
    setSaving(true);

    try {
      let thumbnailId = undefined;
      const thumbnailFile = (
        document.getElementById("thumbnail") as HTMLInputElement
      ).files?.[0];

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
        thumbnailId = uploadData.id; // Use the media ID for Strapi v5
      }

      // Use our API route to update
      // Only send fields that exist in Strapi schema and are allowed to be updated
      const updateData: any = {
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

      // Only include thumbnail if a new one was uploaded
      if (thumbnailId) {
        updateData.thumbnail = thumbnailId;
      }

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
      alert(
        error instanceof Error ? error.message : "Failed to update event"
      );
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