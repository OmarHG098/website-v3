import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureSectionProps {
  title?: string;
  features: Feature[];
}

export default function FeatureSection({ title, features }: FeatureSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} data-testid={`card-feature-${index}`}>
            <CardHeader>
              {feature.icon && (
                <div className="mb-2">
                  <img src={feature.icon} alt="" className="h-12 w-12" />
                </div>
              )}
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
