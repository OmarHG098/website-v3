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
          <Accordion type="single" collapsible className="space-y-3">
            {data.rows.map((row, rowIndex) => (
              <AccordionItem
                key={rowIndex}
                value={`row-${rowIndex}`}
                className={`rounded-card shadow-card px-6 [&]:border-0 ${
                  rowIndex % 2 === 0 ? "bg-card" : "bg-muted/50"
                }`}
                data-testid={`accordion-comparison-${rowIndex}`}
              >
                <AccordionTrigger className="hover:no-underline py-4 min-h-[56px] [&>svg]:w-5 [&>svg]:h-5">
                  <span className="font-semibold text-foreground text-base">
                    {row.feature}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                    {/* 4Geeks Academy side - highlighted with checkmark */}
                    <div className="bg-primary/5 rounded-card p-4 border-l-4 border-primary">
                      <div className="flex items-center gap-1 mb-2">
                        <IconCheck className="w-4 h-4 text-primary" />
                        <p className="text-xs text-primary font-semibold">
                          {data.columns[1]?.name || "4Geeks Academy"}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        <CellValue value={row.values[0]} />
                      </p>
                    </div>
                    {/* VS divider */}
                    <div className="flex items-center justify-center px-2">
                      <span className="text-muted-foreground font-bold text-sm">vs</span>
                    </div>
                    {/* Competitors side */}
                    <div className="bg-muted/50 rounded-card p-4">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        {(data.columns[2]?.name || "Industry Average").replace(" / Competitors", "")}
                      </p>
                      <p className="text-lg text-muted-foreground">
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
