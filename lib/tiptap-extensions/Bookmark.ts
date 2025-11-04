import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface BookmarkOptions {
  HTMLAttributes: Record<string, any>;
}

export interface BookmarkAttributes {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bookmark: {
      setBookmark: (options: BookmarkAttributes) => ReturnType;
    };
  }
}

export const Bookmark = Node.create<BookmarkOptions>({
  name: 'bookmark',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      url: {
        default: null,
      },
      title: {
        default: null,
      },
      description: {
        default: null,
      },
      image: {
        default: null,
      },
      favicon: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-bookmark]',
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          return {
            url: element.getAttribute('href') || '',
            title: element.querySelector('h3')?.textContent || '',
            description: element.querySelector('p.text-sm')?.textContent || '',
            image: element.querySelector('img.w-full')?.getAttribute('src') || '',
            favicon: element.querySelector('img.w-5')?.getAttribute('src') || '',
          };
        },
      },
      {
        tag: 'div[data-bookmark]',
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const link = element.querySelector('a[href]');
          return {
            url: link?.getAttribute('href') || '',
            title: element.querySelector('h3')?.textContent || '',
            description: element.querySelector('p.text-sm')?.textContent || '',
            image: element.querySelector('img.w-full')?.getAttribute('src') || '',
            favicon: element.querySelector('img.w-5')?.getAttribute('src') || '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { url, title, description, image, favicon } = HTMLAttributes;

    const children = [];

    // Add image if exists
    if (image) {
      children.push([
        'div',
        { class: 'bookmark-image' },
        [
          'img',
          {
            src: image,
            alt: title || '',
            class: 'w-full h-48 object-cover',
          },
        ],
      ]);
    }

    // Content section
    const contentChildren = [];

    // Favicon and text container
    const textContent = [];

    if (favicon) {
      textContent.push([
        'img',
        {
          src: favicon,
          alt: '',
          class: 'w-5 h-5 mt-1 flex-shrink-0',
        },
      ]);
    }

    // Text content
    const textElements = [];

    if (title) {
      textElements.push([
        'h3',
        { class: 'font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2' },
        title,
      ]);
    }

    if (description) {
      textElements.push([
        'p',
        { class: 'text-sm text-gray-600 dark:text-gray-400 line-clamp-2' },
        description,
      ]);
    }

    if (url) {
      textElements.push([
        'p',
        { class: 'text-xs text-gray-500 dark:text-gray-500 mt-2 truncate' },
        url,
      ]);
    }

    textContent.push([
      'div',
      { class: 'flex-1 min-w-0' },
      ...textElements,
    ]);

    contentChildren.push([
      'div',
      { class: 'flex items-start gap-3' },
      ...textContent,
    ]);

    children.push([
      'div',
      { class: 'p-4' },
      ...contentChildren,
    ]);

    return [
      'a',
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          'data-bookmark': '',
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'bookmark-card block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 transition-colors my-4',
        }
      ),
      ...children,
    ];
  },

  addCommands() {
    return {
      setBookmark:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      // @ts-ignore - Dynamic import for React component
      require('@/components/editor/BookmarkComponent').default
    );
  },
});
