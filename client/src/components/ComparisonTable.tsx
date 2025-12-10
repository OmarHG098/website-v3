import type { ComparisonTableSection } from "@shared/schema";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

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

        <Card className="hidden md:block overflow-x-auto p-0">
          <table className="w-full border-collapse table-fixed" data-testid="table-comparison">
            <colgroup>
              {data.columns.map((_, colIndex) => (
                <col key={colIndex} style={{ width: `${100 / data.columns.length}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {data.columns.map((column, colIndex) => (
                  <th
                    key={colIndex}
                    className={`p-4 text-left font-semibold text-lg border-b-2 ${
                      column.highlight
                        ? "bg-primary text-primary-foreground rounded-t-lg"
                        : colIndex === 0
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    data-testid={`th-column-${colIndex}`}
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
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
                          : "text-muted-foreground"
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

        <div className="md:hidden space-y-4">
          {data.rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="bg-card rounded-lg border border-border p-4"
              data-testid={`card-comparison-${rowIndex}`}
            >
              <h3 className="font-semibold text-foreground mb-3">{row.feature}</h3>
              {row.feature_description && (
                <p className="text-sm text-muted-foreground mb-3">{row.feature_description}</p>
              )}
              <div className="space-y-2">
                {data.columns.slice(1).map((column, colIndex) => (
                  <div
                    key={colIndex}
                    className={`flex justify-between items-center p-2 rounded ${
                      column.highlight ? "bg-primary/10" : "bg-muted/50"
                    }`}
                  >
                    <span className={`text-sm ${column.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {column.name}
                    </span>
                    <span className={column.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
                      <CellValue value={row.values[colIndex]} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
