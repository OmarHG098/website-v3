import type { ComparisonTableSection } from "@shared/schema";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ComparisonTableProps {
  data: ComparisonTableSection;
}

function CellValue({ value }: { value: string }) {
  if (value === "yes" || value === "Yes" || value === "✓") {
    return (
      <IconCheck className="w-6 h-6 text-green-600 mx-auto" />
    );
  }
  if (value === "no" || value === "No" || value === "✗") {
    return (
      <IconX className="w-6 h-6 text-muted-foreground mx-auto" />
    );
  }
  return <span>{value}</span>;
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const highlightIndex = data.columns.findIndex(col => col.highlight);

  return (
    <section
      className={`py-section ${data.background || "bg-background"}`}
      data-testid="section-comparison-table"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2
            className="text-h2 text-center mb-4 text-foreground"
            data-testid="text-comparison-title"
          >
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p
            className="text-body text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
            data-testid="text-comparison-subtitle"
          >
            {data.subtitle}
          </p>
        )}

        <div className="hidden md:block">
          {/* Comparison table with rounded border */}
          <div className="rounded-xl border border-border overflow-hidden shadow-card" data-testid="table-comparison">
            {/* Header row */}
            <div className="grid grid-cols-3">
              {data.columns.map((column, colIndex) => {
                const isFeatureCol = colIndex === 0;
                const isHighlighted = column.highlight;
                
                return (
                  <div
                    key={colIndex}
                    className={`p-6 font-semibold text-body ${
                      isFeatureCol ? "text-left" : "text-center"
                    } ${
                      isHighlighted
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-foreground"
                    }`}
                    data-testid={`th-column-${colIndex}`}
                  >
                    {column.name}
                  </div>
                );
              })}
            </div>
            {/* Table body */}
            {data.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-3 border-t border-border"
                data-testid={`tr-row-${rowIndex}`}
              >
                {/* Feature name - left aligned */}
                <div className="p-6 font-medium text-foreground text-left bg-card">
                  {row.feature}
                  {row.feature_description && (
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      {row.feature_description}
                    </p>
                  )}
                </div>
                {/* Values */}
                {row.values.map((value, valIndex) => {
                  const isHighlightedCol = valIndex === highlightIndex - 1;
                  
                  return (
                    <div
                      key={valIndex}
                      className={`p-6 text-center ${
                        isHighlightedCol
                          ? "bg-primary/10 font-semibold text-foreground"
                          : "bg-card text-foreground"
                      }`}
                      data-testid={`td-value-${rowIndex}-${valIndex}`}
                    >
                      <CellValue value={value} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <Accordion type="single" collapsible className="space-y-2">
            {data.rows.map((row, rowIndex) => (
              <AccordionItem
                key={rowIndex}
                value={`row-${rowIndex}`}
                className="bg-card rounded-card shadow-card px-4 [&]:border-0"
                data-testid={`accordion-comparison-${rowIndex}`}
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <span className="font-semibold text-foreground uppercase text-sm">
                    {row.feature}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-stretch gap-2">
                    {/* 4Geeks Academy side - highlighted */}
                    <div className="flex-1 bg-primary/10 rounded-card p-3 border-l-[3px] border-primary">
                      <p className="text-xs text-foreground/70 mb-1 font-semibold">
                        {data.columns[1]?.name || "4Geeks Academy"}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        <CellValue value={row.values[0]} />
                      </p>
                    </div>
                    {/* VS divider */}
                    <div className="flex items-center justify-center">
                      <span className="text-foreground/50 font-semibold text-sm">vs</span>
                    </div>
                    {/* Competitors side */}
                    <div className="flex-1 bg-primary/10 rounded-card p-3">
                      <p className="text-xs text-foreground/70 mb-1 font-semibold">
                        {(data.columns[2]?.name || "Industry Average / Competitors").replace(" / Competitors", "")}
                      </p>
                      <p className="text-foreground text-sm">
                        <CellValue value={row.values[1]} />
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {data.footer_note && (
          <p
            className="text-sm text-muted-foreground text-center mt-8"
            data-testid="text-comparison-footer"
          >
            {data.footer_note}
          </p>
        )}
      </div>
    </section>
  );
}
