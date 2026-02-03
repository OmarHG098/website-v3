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

function CellValue({ value, isHighlighted }: { value: string; isHighlighted?: boolean }) {
  const lowerValue = value.toLowerCase();
  
  if (lowerValue === "yes" || lowerValue === "true" || value === "✓" || value === "check") {
    return <IconCheck className="w-6 h-6 text-primary mx-auto" />;
  }
  if (lowerValue === "no" || lowerValue === "false" || value === "✗" || value === "x") {
    return <IconX className="w-6 h-6 text-muted-foreground mx-auto" />;
  }
  
  if (isHighlighted) {
    return (
      <span className="flex items-center justify-center gap-2">
        <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
        <span>{value}</span>
      </span>
    );
  }
  
  return <span>{value}</span>;
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const highlightIndex = data.columns.findIndex(col => col.highlight);
  const columnCount = data.columns.length;

  return (
    <section
      className={`${data.background || "bg-background"}`}
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
          <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5" data-testid="table-comparison">
            <div 
              className="grid"
              style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
            >
              {data.columns.map((column, colIndex) => {
                const isFeatureCol = colIndex === 0;
                const isHighlighted = column.highlight;
                
                return (
                  <div
                    key={colIndex}
                    className={`py-6 px-6 font-semibold text-body ${
                      isFeatureCol ? "text-left" : "text-center"
                    } ${
                      isHighlighted
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                        : "bg-muted text-foreground"
                    }`}
                    data-testid={`th-column-${colIndex}`}
                  >
                    <span>{column.name}</span>
                  </div>
                );
              })}
            </div>
            {data.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid transition-colors hover:bg-primary/5 ${
                  rowIndex % 2 === 0 ? "bg-card" : "bg-muted/30"
                }`}
                style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                data-testid={`tr-row-${rowIndex}`}
              >
                <div className="py-5 px-6 font-medium text-foreground text-left">
                  <span>{row.feature}</span>
                  {row.feature_description && (
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      {row.feature_description}
                    </p>
                  )}
                </div>
                {row.values.map((value, valIndex) => {
                  const isHighlightedCol = valIndex === highlightIndex - 1;
                  
                  return (
                    <div
                      key={valIndex}
                      className={`py-5 px-6 text-center flex items-center justify-center ${
                        isHighlightedCol
                          ? "bg-primary/5 font-semibold text-foreground"
                          : "text-muted-foreground font-normal"
                      }`}
                      data-testid={`td-value-${rowIndex}-${valIndex}`}
                    >
                      <CellValue value={value} isHighlighted={isHighlightedCol} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {data.rows.map((row, rowIndex) => (
              <AccordionItem
                key={rowIndex}
                value={`row-${rowIndex}`}
                className="rounded-card shadow-sm px-6 [&]:border-0 bg-card transition-colors duration-200 data-[state=open]:bg-primary/5 data-[state=open]:shadow-card"
                data-testid={`accordion-comparison-${rowIndex}`}
              >
                <AccordionTrigger className="hover:no-underline py-4 min-h-[56px] [&>svg]:w-5 [&>svg]:h-5">
                  <span className="font-semibold text-foreground text-base">
                    {row.feature}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="flex flex-col gap-3">
                    {row.values.map((value, valIndex) => {
                      const columnName = data.columns[valIndex + 1]?.name || `Column ${valIndex + 2}`;
                      const isHighlightedCol = valIndex === highlightIndex - 1;
                      
                      return (
                        <div 
                          key={valIndex}
                          className={`rounded-card p-4 ${
                            isHighlightedCol 
                              ? "bg-primary/5 border-l-[3px] border-primary" 
                              : "bg-muted/30"
                          }`}
                        >
                          <p className={`text-xs font-semibold mb-1 ${
                            isHighlightedCol ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {columnName}
                          </p>
                          <p className={`text-sm ${
                            isHighlightedCol ? "font-bold text-foreground" : "text-muted-foreground"
                          }`}>
                            <CellValue value={value} isHighlighted={isHighlightedCol} />
                          </p>
                        </div>
                      );
                    })}
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
