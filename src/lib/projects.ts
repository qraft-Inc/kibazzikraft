export type ProjectCategory = "corporate" | "events" | "portraits" | "video";

export type Project = {
  slug: string;
  category: ProjectCategory;
  title: string;
  hero: string;
};

export const categories: { label: string; slug: ProjectCategory }[] = [
  { label: "Corporate", slug: "corporate" },
  { label: "Events", slug: "events" },
  { label: "Portraits", slug: "portraits" },
  { label: "Video", slug: "video" },
];

export const projects: Project[] = [
  {
    slug: "prudentialmdrt2024",
    category: "corporate",
    title: "PRUDENTIAL MDRT 2024",
    hero: "/images/gallery/prudentialmdrt2024/hero.webp",
  },
  {
    slug: "paddymuramiirahceocrownbeveragesforceomagazine",
    category: "corporate",
    title: "Paddy Muramiirah CEO",
    hero: "/images/gallery/paddymuramiirahceocrownbeveragesforceomagazine/hero.webp",
  },
  {
    slug: "prudentialunclemonabimalacampaign",
    category: "corporate",
    title: "Uncle Mo Nabimala",
    hero: "/images/gallery/prudentialunclemonabimalacampaign/hero.webp",
  },
  {
    slug: "letsfacelifetogethercompaign",
    category: "events",
    title: "Lets Face Life Together",
    hero: "/images/gallery/letsfacelifetogethercompaign/hero.webp",
  },
  {
    slug: "afwa",
    category: "events",
    title: "20th AfWA Congress",
    hero: "/images/gallery/afwa/hero.webp",
  },
  {
    slug: "amrefat30",
    category: "events",
    title: "AMREF AT 30",
    hero: "/images/gallery/amrefat30/hero.webp",
  },
  {
    slug: "facesofnamutumba",
    category: "portraits",
    title: "Faces in Places",
    hero: "/images/gallery/facesofnamutumba/hero.webp",
  },
  {
    slug: "alloveruganda",
    category: "portraits",
    title: "UGANDASCAPES",
    hero: "/images/gallery/alloveruganda/hero.webp",
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project])
) as Record<string, Project>;
