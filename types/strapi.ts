// Base Strapi response types
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Strapi v5 changed the data structure - no more attributes wrapper
export interface StrapiData<T> {
  id: number;
  documentId: string;
  [key: string]: any; // All attributes are at root level in v5
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Strapi v5 Media structure - no attributes wrapper
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// Strapi v5 Event structure - all fields at root level
export interface StrapiEvent {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  published: boolean;
  locale?: string;
  thumbnail: StrapiMedia | null;
  images: StrapiMedia[];
  videos?: Array<{
    id: number;
    url: string;
    title?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export type StrapiEventsResponse = StrapiResponse<StrapiEvent[]>;
export type StrapiEventResponse = StrapiResponse<StrapiEvent>;
