import { Event } from "@/types";

// Mock data for development - will be replaced with CMS data
export const mockEvents: Event[] = [
  {
    id: "walk-and-peace-2025",
    title: "Walk & Peace 2025",
    date: "2025-03-21",
    description: "A peaceful march through Busan celebrating unity and global cooperation. Youth from around the world came together to walk for peace.",
    thumbnail: "/images/events/walk-peace-thumb.jpg",
    category: "Campaign",
    tags: ["WalkAndPeace", "March", "Community"],
    images: [
      "/images/events/walk-peace-1.jpg",
      "/images/events/walk-peace-2.jpg",
      "/images/events/walk-peace-3.jpg",
    ],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    content: `
# Walk & Peace 2025

On March 21st, 2025, we organized our flagship event - Walk & Peace. Over 500 participants from 30 countries joined us in a peaceful march through the streets of Busan.

## Highlights

- 500+ participants from 30 countries
- 5km peaceful march route
- Cultural performances at UN Memorial Park
- Messages of peace from youth leaders

## Impact

This event demonstrated the power of youth unity and set the tone for our year-long peace initiatives.
    `,
  },
  {
    id: "un-peace-festival",
    title: "UN Peace Festival",
    date: "2025-05-15",
    description: "A vibrant celebration of cultures, featuring performances, exhibitions, and interactive workshops promoting peace education.",
    thumbnail: "/images/events/peace-festival-thumb.jpg",
    category: "Festival",
    tags: ["Festival", "Culture", "Education"],
    images: [
      "/images/events/festival-1.jpg",
      "/images/events/festival-2.jpg",
    ],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    content: `
# UN Peace Festival

The UN Peace Festival brought together diverse cultures in a celebration of unity and understanding.

## Activities

- Cultural performances from 15 countries
- Peace education workshops
- Art exhibitions
- Interactive peace games

## Attendance

Over 2,000 visitors experienced the festival throughout the day.
    `,
  },
  {
    id: "team-project-showcase",
    title: "Team Project Showcase",
    date: "2025-07-10",
    description: "UNs supporters presented innovative team projects addressing local and global peace challenges.",
    thumbnail: "/images/events/showcase-thumb.jpg",
    category: "Project",
    tags: ["TeamProject", "Innovation", "Presentation"],
    images: [
      "/images/events/showcase-1.jpg",
      "/images/events/showcase-2.jpg",
      "/images/events/showcase-3.jpg",
    ],
    content: `
# Team Project Showcase

Teams presented their innovative solutions to peace-related challenges.

## Projects Presented

- Digital Peace Education Platform
- Cross-Cultural Exchange Program
- Youth Peace Ambassador Network
- Community Peace Building Initiative

## Recognition

All projects received recognition and some are being implemented in local communities.
    `,
  },
  {
    id: "global-youth-dialogue",
    title: "Global Youth Dialogue",
    date: "2025-09-01",
    description: "An international dialogue session connecting youth leaders worldwide to discuss peace initiatives and global challenges.",
    thumbnail: "/images/events/dialogue-thumb.jpg",
    category: "Conference",
    tags: ["Dialogue", "International", "Leadership"],
    images: [
      "/images/events/dialogue-1.jpg",
    ],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    content: `
# Global Youth Dialogue

A groundbreaking online dialogue connecting youth leaders from 50+ countries.

## Topics Discussed

- Climate action and peace
- Digital inclusion for peace building
- Youth leadership in conflict resolution
- Education for sustainable peace

## Outcomes

Declaration of Youth Commitments for Peace 2025-2030
    `,
  },
];

export function getEventById(id: string): Event | undefined {
  return mockEvents.find((event) => event.id === id);
}

export function getEventsByTag(tag: string): Event[] {
  return mockEvents.filter((event) => event.tags.includes(tag));
}
