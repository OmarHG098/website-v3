import type { ComparisonTableSection } from "@shared/schema";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
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
      className={`py-16 md:py-24 ${data.background || "bg-background"}`}
      data-testid="section-comparison-table"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            data-testid="text-comparison-title"
          >
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p
            className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
            data-testid="text-comparison-subtitle"
          >
            {data.subtitle}
          </p>
        )}

        <div className="hidden md:block">
          {/* Header row outside the Card */}
          <div className="flex w-full" style={{ width: '100%' }}>
            {data.columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={`flex-1 p-4 text-left font-semibold text-lg ${
                  column.highlight
                    ? "bg-primary text-primary-foreground rounded-t-lg"
                    : "bg-primary/20 text-foreground rounded-t-lg"
                }`}
                data-testid={`th-column-${colIndex}`}
              >
                {column.name}
              </div>
            ))}
          </div>
          {/* Card with only the body rows */}
          <Card className="overflow-hidden p-0 rounded-t-none">
            <table className="w-full border-collapse table-fixed" data-testid="table-comparison">
              <colgroup>
                {data.columns.map((_, colIndex) => (
                  <col key={colIndex} style={{ width: `${100 / data.columns.length}%` }} />
                ))}
              </colgroup>
              <tbody>
                {data.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-muted/50 transition-colors ${
                      rowIndex % 2 === 0 ? "bg-primary/5" : ""
                    }`}
                    data-testid={`tr-row-${rowIndex}`}
                  >
                    <td className="p-4 font-medium text-foreground">
                      {row.feature}
                      {row.feature_description && (
                        <p className="text-sm text-muted-foreground font-normal mt-1">
                          {row.feature_description}
                        </p>
                      )}
                    </td>
                    {row.values.map((value, valIndex) => (
                      <td
                        key={valIndex}
                        className={`p-4 text-center ${
                          valIndex === highlightIndex - 1
                            ? "bg-primary/10 font-semibold text-foreground"
                            : "text-foreground"
                        }`}
                        data-testid={`td-value-${rowIndex}-${valIndex}`}
                      >
                        <CellValue value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="md:hidden">
          <Accordion type="single" collapsible className="space-y-2">
            {data.rows.map((row, rowIndex) => (
              <AccordionItem
                key={rowIndex}
                value={`row-${rowIndex}`}
                className="bg-card rounded-lg border border-border px-4"
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
                    <div className="flex-1 bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">
                        {data.columns[1]?.name || "4Geeks Academy"}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        <CellValue value={row.values[0]} />
                      </p>
                    </div>
                    {/* VS divider */}
                    <div className="flex items-center justify-center px-2">
                      <span className="text-muted-foreground font-semibold text-sm">vs</span>
                    </div>
                    {/* Competitors side */}
                    <div className="flex-1 bg-primary/10 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">
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
