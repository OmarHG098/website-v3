import { Card, CardContent } from "@/components/ui/card";

interface IconFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface IconFeatureGridProps {
  title: string;
  features: IconFeature[];
}

export default function IconFeatureGrid({ title, features }: IconFeatureGridProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} data-testid={`card-icon-feature-${index}`}>
            <CardContent className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4`}>
                <img src={feature.icon} alt="" className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
