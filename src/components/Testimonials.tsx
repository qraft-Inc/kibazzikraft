import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div key={testimonial.name} className="card">
          <p className="text-sm text-zinc-300">“{testimonial.quote}”</p>
          <p className="mt-4 text-sm font-semibold text-white">
            {testimonial.name}
          </p>
          <p className="text-xs text-zinc-500">{testimonial.role}</p>
        </div>
      ))}
    </div>
  );
}
