"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

export default function InstagramModal({
  isOpen,
  onClose,
  onInsert,
}: InstagramModalProps) {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const extractInstagramData = (url: string): string | null => {
    // Extract Instagram post URL
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagr\.am\/p\/([A-Za-z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const postId = match[1];
        return `https://www.instagram.com/p/${postId}/embed`;
      }
    }
    return null;
  };

  const handleUrlChange = (url: string) => {
    setInstagramUrl(url);
    const embedUrl = extractInstagramData(url);
    if (embedUrl) {
      setEmbedCode(embedUrl);
    } else {
      setEmbedCode('');
    }
  };

  const handleInsert = () => {
    if (embedCode) {
      // Insert as iframe HTML
      const iframeHtml = `<iframe src="${embedCode}" width="400" height="600" frameborder="0" scrolling="no" class="instagram-embed"></iframe>`;
      onInsert(iframeHtml);
      handleClose();
    }
  };

  const handleClose = () => {
    setInstagramUrl('');
    setEmbedCode('');
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
            Insert Instagram Post
          </h2>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram Post URL
            </label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.instagram.com/p/POST_ID/"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supports: instagram.com/p/..., instagram.com/reel/..., or instagr.am/p/...
            </p>
          </div>

          {/* Preview */}
          {embedCode && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <iframe
                  src={embedCode}
                  width="400"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded-lg"
                  title="Instagram post preview"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleInsert}
              disabled={!embedCode}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Post
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
