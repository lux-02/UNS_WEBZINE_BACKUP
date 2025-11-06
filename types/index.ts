export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailId?: number;
  category: string;
  tags: string[];
  images?: string[];
  videos?: string[];
  content?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  position: number;
}
