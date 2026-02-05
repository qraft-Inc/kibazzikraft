import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import ApprenticeshipForm from "@/components/ApprenticeshipForm";
import { siteContact } from "@/data/site";

export default function ApprenticeshipsPage() {
  return (
    <div className="space-y-16 pb-20">
      <Section
        title="Apprenticeships That Build Careers"
        subtitle="Join our proven training programs — 90% completion, real portfolios, employment-ready."
      >
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 text-sm text-zinc-300">
            <p>
              Kibazzi Kraft delivers hands-on photography and videography training
              designed for real-world production workflows.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={siteContact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                For Companies
              </Link>
              <Link href="#individuals" className="btn-outline w-full sm:w-auto">
                For Individuals
              </Link>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-zinc-800/70">
            <Image
              src="/apprenticeships/hero-apprenticeship.svg"
              alt="Kibazzi Kraft apprenticeships"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Section>

      <Section title="Women in Technology Uganda (WITU) Program — November 2025">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-sm text-zinc-300">
            <p>
              2-week hands-on program in photography, videography, and digital
              marketing based in Kyebando, Kampala.
            </p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>✅ 90% completion rate, 8 women trained</li>
              <li>✅ Real portfolios + industry workflows (Lightroom, Premiere Pro)</li>
              <li>✅ Employment-ready candidates identified</li>
              <li>✅ Mentors: Pius Kibazzi (8yrs), Kavuma George (4yrs), Claire Kakose (4yrs)</li>
            </ul>
            <p className="text-sm text-zinc-400">
              “90% completion. Real portfolios. Employment candidates identified.”
            </p>
            <Link
              href="/apprenticeships/witu-report.pdf"
              className="btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              View WITU Report PDF
            </Link>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-zinc-800/70">
            <Image
              src="/apprenticeships/stats-bg.svg"
              alt="WITU program highlights"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section title="Why Partner With Kibazzi Kraft Apprenticeships?">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Pre-screened, employment-ready talent",
            "Proven training pipeline (WITU success)",
            "Custom programs aligned to your brand",
            "Uganda's creative industry leaders",
            "Investment: UGX 5M per cohort → 8 trained candidates",
          ].map((item) => (
            <div key={item} className="card">
              <p className="text-sm text-zinc-200">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href={siteContact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            Contact Corporate
          </Link>
        </div>
      </Section>

      <Section title="2-Week Apprenticeship Program" subtitle="Week 1: Photography fundamentals + Lightroom | Week 2: Videography + Premiere Pro | Digital Marketing bonus">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]" id="individuals">
          <div className="space-y-4 text-sm text-zinc-300">
            <p>
              Cost: <span className="text-white">UGX 500,000</span> (includes
              mentorship + portfolio build).
            </p>
            <p>
              Submit your details to apply. Our team will follow up with schedule
              and intake requirements.
            </p>
          </div>
          <div className="card">
            <ApprenticeshipForm />
          </div>
        </div>
      </Section>

      <Section title="Partner With Us">
        <div className="card">
          <p className="text-sm text-zinc-300">
            Let’s design a training cohort for your organization or community.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href={siteContact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Partner With Us
            </Link>
            <Link href="/contact" className="btn-outline w-full sm:w-auto">
              View Contact Details
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
