import Image from "next/image";
import Link from "next/link";
import { siteContact } from "@/data/site";

export default function Hero() {
  return (
    <section className="container grid items-center gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-16">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
          Kampala-based Studio
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Corporate, Event & Portrait Photography for Uganda&apos;s Leading Brands
        </h1>
        <p className="mt-4 text-sm text-zinc-300 sm:text-base">
          We help businesses and NGOs tell authentic stories through premium
          visuals, with fast turnaround and thoughtful direction.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link
            href={siteContact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            Book a Session
          </Link>
          <Link href="/portfolio" className="btn-outline w-full sm:w-auto">
            View Portfolio
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-900/60">
        <Image
          src="/images/home-hero.jpg"
          alt="Kibazzi Kraft hero"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
