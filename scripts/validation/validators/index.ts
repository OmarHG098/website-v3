/**
 * Validators Registry
 * 
 * Exports all available validators and provides discovery utilities.
 */

import type { Validator, ValidatorMetadata } from "../shared/types";
import { redirectValidator } from "./redirects";
import { metaValidator } from "./meta";
import { schemaValidator } from "./schema";
import { sitemapValidator } from "./sitemap";
import { componentsValidator } from "./components";
import { backgroundsValidator } from "./backgrounds";
import { faqsValidator } from "./faqs";

export const validators: Validator[] = [
  redirectValidator,
  metaValidator,
  schemaValidator,
  sitemapValidator,
  componentsValidator,
  backgroundsValidator,
  faqsValidator,
];

export const validatorMap = new Map<string, Validator>(
  validators.map((v) => [v.name, v])
);

export function getValidator(name: string): Validator | undefined {
  return validatorMap.get(name);
}

export function listValidators(): ValidatorMetadata[] {
  return validators.map((v) => ({
    name: v.name,
    description: v.description,
    apiExposed: v.apiExposed,
    estimatedDuration: v.estimatedDuration,
    category: v.category,
  }));
}

export function getApiExposedValidators(): Validator[] {
  return validators.filter((v) => v.apiExposed);
}

export {
  redirectValidator,
  metaValidator,
  schemaValidator,
  sitemapValidator,
  componentsValidator,
  backgroundsValidator,
  faqsValidator,
};
