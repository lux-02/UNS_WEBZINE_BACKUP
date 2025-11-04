"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (metadata: BookmarkMetadata) => void;
}

export interface BookmarkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  favicon: string;
}

export default function BookmarkModal({
  isOpen,
  onClose,
  onInsert,
}: BookmarkModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<BookmarkMetadata | null>(null);
  const [error, setError] = useState('');
  const [shouldInsert, setShouldInsert] = useState(false);

  const fetchMetadata = async (inputUrl: string) => {
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Ensure URL has protocol
      let fullUrl = inputUrl.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }

      const response = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fullUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setMetadata(data.data);
      } else {
        throw new Error('Failed to fetch metadata');
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError('Failed to fetch link preview. Please check the URL and try again.');
      // Create basic metadata from URL
      setMetadata({
        title: inputUrl,
        description: '',
        image: '',
        url: inputUrl,
        favicon: '',
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-insert when metadata is fetched and shouldInsert is true
  useEffect(() => {
    if (metadata && shouldInsert && !loading) {
      onInsert(metadata);
      handleClose();
    }
  }, [metadata, shouldInsert, loading]);

  const handleFetchAndInsert = async () => {
    if (!url.trim()) return;
    setShouldInsert(true);
    await fetchMetadata(url);
  };

  const handleClose = () => {
    setUrl('');
    setMetadata(null);
    setError('');
    setShouldInsert(false);
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
            Add Bookmark
          </h2>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && url.trim() && !loading) {
                  e.preventDefault();
                  handleFetchAndInsert();
                }
              }}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* Preview */}
          {metadata && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
              >
                {metadata.image && (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metadata.image}
                      alt={metadata.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {metadata.favicon && (
                      <img
                        src={metadata.favicon}
                        alt=""
                        className="w-5 h-5 mt-1 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {metadata.title}
                      </h3>
                      {metadata.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {metadata.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                        {metadata.url}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleFetchAndInsert}
              disabled={loading || !url.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching...' : 'Fetch & Insert Bookmark'}
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
