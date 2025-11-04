import { Node, mergeAttributes } from '@tiptap/core';

export interface InstagramOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    instagram: {
      setInstagram: (options: { src: string }) => ReturnType;
    };
  }
}

export const Instagram = Node.create<InstagramOptions>({
  name: 'instagram',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-instagram-embed]',
        getAttrs: (dom) => {
          const iframe = (dom as HTMLElement).querySelector('iframe');
          return {
            src: iframe?.getAttribute('src') || null,
          };
        },
      },
      {
        tag: 'a[data-instagram-embed]',
        getAttrs: (dom) => {
          const iframe = (dom as HTMLElement).querySelector('iframe');
          return {
            src: iframe?.getAttribute('src') || null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          'data-instagram-embed': '',
          class: 'instagram-embed-wrapper my-4 flex justify-center',
        }
      ),
      [
        'iframe',
        mergeAttributes(HTMLAttributes, {
          src: HTMLAttributes.src,
          width: '400',
          height: '600',
          frameborder: '0',
          scrolling: 'no',
          class: 'rounded-lg shadow-lg',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setInstagram:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
