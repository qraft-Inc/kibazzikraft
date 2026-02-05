import Section from "@/components/Section";
import { services } from "@/data/services";
import Link from "next/link";
import { siteContact } from "@/data/site";

export default function ServicesPage() {
  return (
    <div className="space-y-16 pb-20">
      <Section
        title="Services"
        subtitle="Flexible packages for corporate clients, NGOs, and event teams."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="card">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">
                {service.description}
              </p>
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
            Request Pricing
          </Link>
        </div>
      </Section>
    </div>
  );
}
