import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Go back home
      </Link>
    </div>
  );
}
