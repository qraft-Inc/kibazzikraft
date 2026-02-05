import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import CategoryTabs from "@/components/CategoryTabs";
import { categories, projects, ProjectCategory } from "@/lib/projects";

export async function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default function PortfolioCategoryPage({
  params,
}: {
  params: { category: ProjectCategory };
}) {
  const category = categories.find((item) => item.slug === params.category);
  const filtered = projects.filter(
    (project) => project.category === params.category
  );

  return (
    <div className="space-y-16 pb-20">
      <Section
        title={`${category?.label ?? "Portfolio"} Projects`}
        subtitle="Choose a project to view the full gallery."
      >
        <CategoryTabs />
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.category}/${project.slug}`}
              className="group card overflow-hidden border-zinc-800/70 p-0"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={project.hero}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">View gallery</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
