"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface YoutubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

export default function YoutubeModal({
  isOpen,
  onClose,
  onInsert,
}: YoutubeModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [previewId, setPreviewId] = useState('');

  const extractVideoId = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractVideoId(url);
    if (videoId) {
      setPreviewId(videoId);
    } else {
      setPreviewId('');
    }
  };

  const handleInsert = () => {
    if (youtubeUrl.trim()) {
      onInsert(youtubeUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setYoutubeUrl('');
    setPreviewId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Insert YouTube Video
          </h2>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube URL or Video ID
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID or VIDEO_ID"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supports: youtube.com/watch?v=..., youtu.be/..., or direct video ID
            </p>
          </div>

          {/* Preview */}
          {previewId && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="aspect-video w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${previewId}`}
                  className="w-full h-full"
                  allowFullScreen
                  title="YouTube video preview"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleInsert}
              disabled={!youtubeUrl.trim() || !previewId}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Video
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
