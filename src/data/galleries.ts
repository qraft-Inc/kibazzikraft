import type { Photo } from "react-photo-album";

export type GalleryPhoto = Photo & {
  alt: string;
  category: "Corporate" | "Events" | "Portraits" | "Video";
  caption?: string;
};

const basePhoto: Omit<GalleryPhoto, "alt" | "category"> = {
  src: "/images/gallery/placeholder.svg",
  width: 1200,
  height: 900,
};

const corporate: GalleryPhoto[] = [
  {
    ...basePhoto,
    alt: "Boardroom strategy session",
    category: "Corporate",
    caption: "Corporate leadership session in Kampala.",
  },
  {
    ...basePhoto,
    alt: "Team portrait",
    category: "Corporate",
    caption: "Executive portrait for annual report.",
  },
  {
    ...basePhoto,
    alt: "Brand launch event",
    category: "Corporate",
    caption: "Product launch coverage.",
  },
];

const events: GalleryPhoto[] = [
  {
    ...basePhoto,
    alt: "Conference keynote",
    category: "Events",
    caption: "Keynote speaker at NGO summit.",
  },
  {
    ...basePhoto,
    alt: "Networking moments",
    category: "Events",
    caption: "Candid moments for social highlights.",
  },
  {
    ...basePhoto,
    alt: "Awards ceremony",
    category: "Events",
    caption: "Celebrations and award coverage.",
  },
];

const portraits: GalleryPhoto[] = [
  {
    ...basePhoto,
    alt: "Studio portrait",
    category: "Portraits",
    caption: "Modern studio portrait session.",
  },
  {
    ...basePhoto,
    alt: "Executive headshot",
    category: "Portraits",
    caption: "Executive headshot with soft lighting.",
  },
  {
    ...basePhoto,
    alt: "Creative portrait",
    category: "Portraits",
    caption: "Lifestyle portrait in Kampala.",
  },
];

const video: GalleryPhoto[] = [
  {
    ...basePhoto,
    alt: "Interview setup",
    category: "Video",
    caption: "Client interview recording.",
  },
  {
    ...basePhoto,
    alt: "Event recap",
    category: "Video",
    caption: "Highlight reel for corporate event.",
  },
  {
    ...basePhoto,
    alt: "Behind the scenes",
    category: "Video",
    caption: "Behind the scenes of production day.",
  },
];

export const galleries = {
  Corporate: corporate,
  Events: events,
  Portraits: portraits,
  Video: video,
};

export const featuredPhotos = [
  ...corporate.slice(0, 2),
  ...events.slice(0, 2),
  ...portraits.slice(0, 2),
];
