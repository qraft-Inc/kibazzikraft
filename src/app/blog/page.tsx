import Link from "next/link";
import Section from "@/components/Section";
import { getAllPosts } from "@/lib/mdx";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-16 pb-20">
      <Section
        title="Blog"
        subtitle="Case studies and photography tips from Kampala."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card transition hover:border-zinc-600"
            >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 text-xs text-zinc-500">{post.date}</p>
              <p className="mt-3 text-sm text-zinc-300">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
