export default function StatsSection() {
  const stats = [
    {
      value: "20,000",
      label: "Students Graduated",
      sublabel: "Join our global community",
    },
    {
      value: "5000",
      label: "Hours of Content",
      sublabel: "Expert-led instruction",
    },
    {
      value: "85%",
      label: "Job Placement",
      sublabel: "Within 6 months",
    },
  ];

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why join us?</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <p className="text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-lg font-semibold mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
