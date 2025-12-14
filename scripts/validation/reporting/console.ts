/**
 * Console Reporter
 * 
 * Pretty-prints validation results to the terminal.
 */

import type { ValidationRunResult, ValidatorResult, ValidationIssue } from "../shared/types";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatIssue(issue: ValidationIssue, indent = "  "): string {
  const prefix = issue.type === "error" ? colorize("✗", "red") : colorize("⚠", "yellow");
  let line = `${indent}${prefix} [${issue.code}] ${issue.message}`;
  
  if (issue.file) {
    line += colorize(` (${issue.file})`, "gray");
  }
  
  if (issue.suggestion) {
    line += `\n${indent}  ${colorize("→", "cyan")} ${issue.suggestion}`;
  }
  
  return line;
}

function formatValidatorResult(result: ValidatorResult): string {
  const lines: string[] = [];
  
  const statusIcon = result.status === "passed" 
    ? colorize("✓", "green") 
    : result.status === "warning" 
      ? colorize("⚠", "yellow") 
      : colorize("✗", "red");
  
  const statusText = result.status === "passed"
    ? colorize("PASSED", "green")
    : result.status === "warning"
      ? colorize("WARNING", "yellow")
      : colorize("FAILED", "red");
  
  lines.push(`${statusIcon} ${colorize(result.name, "bold")} - ${statusText} (${result.duration}ms)`);
  lines.push(colorize(`  ${result.description}`, "gray"));
  
  if (result.errors.length > 0) {
    lines.push(`  ${colorize(`Errors (${result.errors.length}):`, "red")}`);
    for (const error of result.errors) {
      lines.push(formatIssue(error, "    "));
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push(`  ${colorize(`Warnings (${result.warnings.length}):`, "yellow")}`);
    for (const warning of result.warnings) {
      lines.push(formatIssue(warning, "    "));
    }
  }
  
  return lines.join("\n");
}

export function printResults(result: ValidationRunResult): void {
  console.log("\n" + colorize("═".repeat(60), "blue"));
  console.log(colorize("  VALIDATION RESULTS", "bold"));
  console.log(colorize("═".repeat(60), "blue") + "\n");
  
  for (const validatorResult of result.validators) {
    console.log(formatValidatorResult(validatorResult));
    console.log();
  }
  
  console.log(colorize("─".repeat(60), "gray"));
  console.log(colorize("  SUMMARY", "bold"));
  console.log(colorize("─".repeat(60), "gray"));
  
  const { summary } = result;
  console.log(`  Total validators: ${summary.total}`);
  console.log(`  ${colorize("Passed:", "green")} ${summary.passed}`);
  console.log(`  ${colorize("Warnings:", "yellow")} ${summary.warnings}`);
  console.log(`  ${colorize("Failed:", "red")} ${summary.failed}`);
  console.log(`  Duration: ${summary.duration}ms`);
  
  console.log();
  
  if (summary.failed > 0) {
    console.log(colorize("✗ Validation FAILED", "red"));
  } else if (summary.warnings > 0) {
    console.log(colorize("⚠ Validation passed with warnings", "yellow"));
  } else {
    console.log(colorize("✓ Validation PASSED", "green"));
  }
  
  console.log();
}

export function printValidatorList(validators: { name: string; description: string; category: string }[]): void {
  console.log("\n" + colorize("Available Validators:", "bold") + "\n");
  
  const byCategory = new Map<string, typeof validators>();
  for (const v of validators) {
    const category = v.category || "other";
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(v);
  }
  
  for (const [category, categoryValidators] of byCategory) {
    console.log(colorize(`  ${category.toUpperCase()}`, "cyan"));
    for (const v of categoryValidators) {
      console.log(`    ${colorize(v.name, "bold")} - ${v.description}`);
    }
    console.log();
  }
}
