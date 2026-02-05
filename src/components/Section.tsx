export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container">
      <div className="mb-8">
        <h2 className="section-title">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
