import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import Section from "@/components/Section";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  return (
    <div className="space-y-16 pb-20">
      <Section title={post.frontmatter.title ?? "Blog"}>
        <article className="prose prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </article>
      </Section>
    </div>
  );
}
