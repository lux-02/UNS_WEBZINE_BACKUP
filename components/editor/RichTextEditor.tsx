"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize } from "@/lib/tiptap-extensions/FontSize";
import { Instagram } from "@/lib/tiptap-extensions/Instagram";
import { Bookmark } from "@/lib/tiptap-extensions/Bookmark";
import { useCallback, useState } from "react";
import ImageUploadModal from "./ImageUploadModal";
import YoutubeModal from "./YoutubeModal";
import InstagramModal from "./InstagramModal";
import BookmarkModal, { BookmarkMetadata } from "./BookmarkModal";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaLink,
  FaImage,
  FaYoutube,
  FaInstagram,
  FaBookmark,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHeading,
} from "react-icons/fa";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentFontFamily, setCurrentFontFamily] = useState("inherit");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: {
          keepMarks: true,
        },
      }),
      TextStyle,
      FontSize,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "center",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg mx-auto block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-600 underline",
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-lg my-4",
        },
      }),
      Instagram.configure({
        HTMLAttributes: {
          class: "instagram-embed-wrapper",
        },
      }),
      Bookmark.configure({
        HTMLAttributes: {
          class: "bookmark-card",
        },
      }),
    ],
    content,
    editable,
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Update current font size based on selection
      const fontSize = editor.getAttributes("textStyle").fontSize;
      if (fontSize) {
        setCurrentFontSize(fontSize);
      } else {
        setCurrentFontSize("16px"); // Reset to default if no fontSize is set
      }

      // Update current color based on selection
      const color = editor.getAttributes("textStyle").color;
      if (color) {
        setCurrentColor(color);
      }

      // Update current font family based on selection
      const fontFamily = editor.getAttributes("textStyle").fontFamily;
      if (fontFamily) {
        setCurrentFontFamily(fontFamily);
      } else {
        setCurrentFontFamily("inherit");
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2",
      },
    },
  });

  const addImage = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  const insertImage = useCallback(
    (url: string) => {
      if (editor) {
        // Use queueMicrotask to avoid flushSync warning
        queueMicrotask(() => {
          // Insert image and automatically center align it
          editor
            .chain()
            .focus()
            .setImage({ src: url })
            .setTextAlign("center")
            .run();
        });
      }
    },
    [editor]
  );

  const setFontSize = useCallback(
    (size: string) => {
      if (editor) {
        // Only apply font size if there's a selection or current position
        const { from, to } = editor.state.selection;
        if (from !== to) {
          // There's a selection, apply font size
          editor.chain().focus().setFontSize(size).run();
        } else {
          // No selection, set mark for next typed text
          editor.chain().focus().setFontSize(size).run();
        }
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    setIsYoutubeModalOpen(true);
  }, []);

  const insertYoutubeVideo = useCallback(
    (url: string) => {
      if (editor) {
        // Use queueMicrotask to avoid flushSync warning
        queueMicrotask(() => {
          editor.chain().focus().setYoutubeVideo({ src: url }).run();
        });
      }
    },
    [editor]
  );

  const setTextColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
        setCurrentColor(color);
      }
    },
    [editor]
  );

  const changeFontFamily = useCallback(
    (fontFamily: string) => {
      if (editor) {
        if (fontFamily === "inherit") {
          editor.chain().focus().unsetFontFamily().run();
        } else {
          editor.chain().focus().setFontFamily(fontFamily).run();
        }
        setCurrentFontFamily(fontFamily);
      }
    },
    [editor]
  );

  const addInstagramPost = useCallback(() => {
    setIsInstagramModalOpen(true);
  }, []);

  const insertInstagramPost = useCallback(
    (html: string) => {
      if (editor) {
        // Use queueMicrotask to avoid flushSync warning
        queueMicrotask(() => {
          // Extract the embed URL from the HTML
          const srcMatch = html.match(/src="([^"]+)"/);
          if (srcMatch) {
            editor.chain().focus().setInstagram({ src: srcMatch[1] }).run();
          }
        });
      }
    },
    [editor]
  );

  const addBookmark = useCallback(() => {
    setIsBookmarkModalOpen(true);
  }, []);

  const insertBookmark = useCallback(
    (metadata: BookmarkMetadata) => {
      if (editor) {
        // Use queueMicrotask to avoid flushSync warning
        queueMicrotask(() => {
          editor
            .chain()
            .focus()
            .setBookmark({
              url: metadata.url,
              title: metadata.title,
              description: metadata.description,
              image: metadata.image,
              favicon: metadata.favicon,
            })
            .run();
        });
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  if (!editable) {
    return <EditorContent editor={editor} />;
  }

  return (
    <>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1 items-center">
          {/* Font Family Selector */}
          <select
            value={currentFontFamily}
            onChange={(e) => changeFontFamily(e.target.value)}
            className="px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: currentFontFamily }}
          >
            <option value="inherit">기본 폰트</option>
            <option value="Pretendard" style={{ fontFamily: "Pretendard" }}>
              Pretendard
            </option>
            <option value="Paperozi" style={{ fontFamily: "Paperozi" }}>
              Paperozi
            </option>
            <option value="Noto Sans KR" style={{ fontFamily: "Noto Sans KR" }}>
              Noto Sans KR
            </option>
            <option
              value="Cafe24Surround"
              style={{ fontFamily: "Cafe24Surround" }}
            >
              Cafe24 Surround
            </option>
            <option
              value="Nanum Myeongjo"
              style={{ fontFamily: "Nanum Myeongjo" }}
            >
              Nanum Myeongjo
            </option>
            <option value="NanumSquare" style={{ fontFamily: "NanumSquare" }}>
              Nanum Square
            </option>
            <option
              value="GrandpaSSharing"
              style={{ fontFamily: "GrandpaSSharing" }}
            >
              할아버지의 나눔
            </option>
            <option value="Arial" style={{ fontFamily: "Arial" }}>
              Arial
            </option>
            <option value="Georgia" style={{ fontFamily: "Georgia" }}>
              Georgia
            </option>
            <option
              value="Times New Roman"
              style={{ fontFamily: "Times New Roman" }}
            >
              Times New Roman
            </option>
            <option value="Courier New" style={{ fontFamily: "Courier New" }}>
              Courier New
            </option>
          </select>

          {/* Font Size Selector */}
          <select
            value={currentFontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px (기본)</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
            <option value="48px">48px</option>
          </select>

          {/* Text Color Picker */}
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
              title="Text Color"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Color
            </span>
          </div>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 h-6" />

          {/* Text Alignment */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "left" })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Align Left"
          >
            <FaAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "center" })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Align Center"
          >
            <FaAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "right" })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Align Right"
          >
            <FaAlignRight />
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 h-6" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("bold")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("italic")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("strike")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Strikethrough"
          >
            <FaStrikethrough />
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("bulletList")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("orderedList")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Numbered List"
          >
            <FaListOl />
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("blockquote")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Blockquote"
          >
            <FaQuoteLeft />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("codeBlock")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaCode />
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("link")
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title="Link"
          >
            <FaLink />
          </button>
          <button
            type="button"
            onClick={addBookmark}
            className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            title="Bookmark"
          >
            <FaBookmark />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            title="Image"
          >
            <FaImage />
          </button>
          <button
            type="button"
            onClick={addYoutubeVideo}
            className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            title="YouTube"
          >
            <FaYoutube />
          </button>
          <button
            type="button"
            onClick={addInstagramPost}
            className="px-3 py-1 rounded text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
            title="Instagram"
          >
            <FaInstagram />
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <FaUndo />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <FaRedo />
          </button>
        </div>

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={insertImage}
      />

      {/* YouTube Modal */}
      <YoutubeModal
        isOpen={isYoutubeModalOpen}
        onClose={() => setIsYoutubeModalOpen(false)}
        onInsert={insertYoutubeVideo}
      />

      {/* Instagram Modal */}
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        onInsert={insertInstagramPost}
      />

      {/* Bookmark Modal */}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onInsert={insertBookmark}
      />
    </>
  );
}
