import Image from "next/image";
import Section from "@/components/Section";
import CategoryTabs from "@/components/CategoryTabs";
import { projectBySlug, projects } from "@/lib/projects";

export async function generateStaticParams() {
  return projects.map((project) => ({
    category: project.category,
    slug: project.slug,
  }));
}

export default function ProjectPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const project = projectBySlug[params.slug];

  if (!project) {
    return (
      <div className="container py-24">
        <p className="text-sm text-zinc-400">Project not found.</p>
      </div>
    );
  }

  const gallery = Array.from({ length: 12 }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    return `/images/gallery/${project.slug}/${number}.webp`;
  });

  return (
    <div className="space-y-16 pb-20">
      <Section title={project.title}>
        <CategoryTabs />
        <div className="space-y-6">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-zinc-800/70">
            <Image
              src={project.hero}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((src) => (
              <div
                key={src}
                className="relative h-48 w-full overflow-hidden rounded-2xl border border-zinc-800/60"
              >
                <Image src={src} alt={project.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
