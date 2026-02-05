import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import CategoryTabs from "@/components/CategoryTabs";
import { projects } from "@/lib/projects";

export default function PortfolioPage() {
  return (
    <div className="space-y-16 pb-20">
      <Section
        title="Portfolio"
        subtitle="Explore corporate, events, portraits, and videography highlights."
      >
        <CategoryTabs />
        <div className="mt-10">
          <h3 className="text-xl font-semibold">Featured Projects</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Select a project to view the full gallery.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
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
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {project.category}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
