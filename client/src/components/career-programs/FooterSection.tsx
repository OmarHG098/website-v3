import type { FooterSection as FooterSectionType } from "@shared/schema";

interface FooterSectionProps {
  data: FooterSectionType;
}

export function FooterSection({ data }: FooterSectionProps) {
  return (
    <footer 
      className="py-8 bg-background border-t"
      data-testid="section-footer"
    >
      <div className="container mx-auto px-4 text-center">
        <p 
          className="text-sm text-muted-foreground"
          data-testid="text-copyright"
        >
          {data.copyright_text}
        </p>
      </div>
    </footer>
  );
}
