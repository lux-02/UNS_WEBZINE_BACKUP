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
    <NodeViewWrapper className="bookmark-wrapper my-5 select-none">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-card flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
        contentEditable={false}
      >
        {image && (
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2">
            {favicon && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={favicon}
                alt=""
                className="w-4 h-4 flex-shrink-0 rounded-sm"
              />
            )}
            {url && (
              <p className="text-sm text-gray-400 dark:text-gray-500 truncate">
                {url}
              </p>
            )}
          </div>
        </div>
      </a>
    </NodeViewWrapper>
  );
}
