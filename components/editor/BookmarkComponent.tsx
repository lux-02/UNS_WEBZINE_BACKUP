"use client";

import { NodeViewWrapper } from '@tiptap/react';

interface BookmarkComponentProps {
  node: {
    attrs: {
      url: string;
      title: string;
      description: string;
      image: string;
      favicon: string;
    };
  };
}

export default function BookmarkComponent({ node }: BookmarkComponentProps) {
  const { url, title, description, image, favicon } = node.attrs;

  return (
    <NodeViewWrapper className="bookmark-wrapper my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-card block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
        contentEditable={false}
      >
        {image && (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {favicon && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={favicon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {description}
                </p>
              )}
              {url && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                  {url}
                </p>
              )}
            </div>
          </div>
        </div>
      </a>
    </NodeViewWrapper>
  );
}
