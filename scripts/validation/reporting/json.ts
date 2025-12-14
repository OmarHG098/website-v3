/**
 * JSON Reporter
 * 
 * Outputs validation results as JSON for CI/CD and API consumption.
 */

import type { ValidationRunResult } from "../shared/types";

export interface JsonReportOptions {
  pretty?: boolean;
  includeTimestamp?: boolean;
}

export function formatAsJson(result: ValidationRunResult, options: JsonReportOptions = {}): string {
  const output: Record<string, unknown> = {
    ...result,
  };
  
  if (options.includeTimestamp) {
    output.timestamp = new Date().toISOString();
  }
  
  return options.pretty 
    ? JSON.stringify(output, null, 2) 
    : JSON.stringify(output);
}

export function printJsonResults(result: ValidationRunResult, options: JsonReportOptions = {}): void {
  console.log(formatAsJson(result, { ...options, pretty: true }));
}

export function getExitCode(result: ValidationRunResult): number {
  return result.summary.failed > 0 ? 1 : 0;
}
