"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  // If content contains HTML (from TipTap editor), render it directly
  // This preserves all HTML formatting including line breaks
  const isHtmlContent = content.includes("<") && content.includes(">");

  if (isHtmlContent) {
    return (
      <div
        className={`markdown-content prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none ${className}`}
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // For plain markdown content, use ReactMarkdown
  return (
    <div
      className={`markdown-content ${className}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customize div for special embeds
          div: ({ node, ...props }: any) => {
            const className = props.className || "";

            // Instagram embed
            if (props["data-instagram-embed"] !== undefined) {
              const iframe = node?.children?.find(
                (child: any) => child.tagName === "iframe"
              );
              if (iframe) {
                return (
                  <div className="instagram-embed-wrapper my-4 flex justify-center">
                    <iframe
                      src={iframe.properties?.src}
                      width="400"
                      height="600"
                      frameBorder="0"
                      scrolling="no"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                );
              }
            }

            return <div className={className} {...props} />;
          },
          // Customize links for bookmarks
          a: ({ node, ...props }: any) => {
            // Check if it's a bookmark
            if (props["data-bookmark"] !== undefined) {
              const children = node?.children || [];
              let imageUrl = "";
              let title = "";
              let description = "";
              let url = props.href || "";
              let favicon = "";

              // Extract data from children
              children.forEach((child: any) => {
                if (
                  child.tagName === "div" &&
                  child.properties?.className?.includes("bookmark-image")
                ) {
                  const img = child.children?.[0];
                  if (img?.tagName === "img") {
                    imageUrl = img.properties?.src || "";
                  }
                }
                if (
                  child.tagName === "div" &&
                  child.properties?.className?.includes("p-4")
                ) {
                  const flexDiv = child.children?.[0];
                  if (flexDiv) {
                    flexDiv.children?.forEach((element: any) => {
                      if (element.tagName === "img") {
                        favicon = element.properties?.src || "";
                      }
                      if (
                        element.tagName === "div" &&
                        element.properties?.className?.includes("flex-1")
                      ) {
                        element.children?.forEach((textElement: any) => {
                          if (textElement.tagName === "h3") {
                            title = textElement.children?.[0]?.value || "";
                          }
                          if (
                            textElement.tagName === "p" &&
                            textElement.properties?.className?.includes(
                              "text-sm"
                            )
                          ) {
                            description =
                              textElement.children?.[0]?.value || "";
                          }
                        });
                      }
                    });
                  }
                }
              });

              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bookmark-card block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 transition-colors my-4"
                >
                  {imageUrl && (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {favicon && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={favicon}
                          alt=""
                          className="w-5 h-5 mt-1 flex-shrink-0"
                        />
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
              );
            }

            // Regular link
            return (
              <a
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            );
          },
          // Customize iframe for YouTube embeds
          iframe: ({ node, ...props }) => {
            // Filter out string boolean attributes to avoid React warnings
            const { autoPlay, loop, ...iframeProps } = props as any;
            return (
              <div className="aspect-video w-full my-4">
                <iframe
                  className="w-full h-full rounded-lg"
                  {...iframeProps}
                  allowFullScreen
                />
              </div>
            );
          },
          // Customize heading styles
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-white"
              {...props}
            />
          ),
          // Customize paragraph - preserve line breaks
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
              {...props}
            />
          ),
          // Customize lists
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          // Customize blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
              {...props}
            />
          ),
          // Customize code blocks
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
                {...props}
              />
            );
          },
          // Customize pre (code block wrapper)
          pre: ({ node, ...props }) => (
            <pre className="my-4 overflow-x-auto" {...props} />
          ),
          // Customize images - always center align
          img: ({ node, ...props }) => (
            <div className="flex justify-center my-4">
              <img
                className="max-w-full h-auto rounded-lg shadow-lg"
                {...props}
                alt={props.alt || ""}
              />
            </div>
          ),
          // Customize horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-gray-300 dark:border-gray-700"
              {...props}
            />
          ),
          // Customize tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="divide-y divide-gray-200 dark:divide-gray-700"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => <tr {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          // Customize strong/bold
          strong: ({ node, ...props }) => (
            <strong
              className="font-bold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          // Customize emphasis/italic
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          // Customize br tag for line breaks - force display
          br: ({ node, ...props }) => (
            <br style={{ display: "block", margin: "0.5em 0" }} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
