"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/projects";

export default function CategoryTabs() {
  const pathname = usePathname();
  const activeCategory = pathname?.split("/")[2] ?? "all";

  const baseClasses =
    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition";

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/portfolio"
        className={`${baseClasses} ${
          activeCategory === "all"
            ? "border-accent-500 text-white"
            : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/portfolio/${category.slug}`}
          className={`${baseClasses} ${
            activeCategory === category.slug
              ? "border-accent-500 text-white"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
