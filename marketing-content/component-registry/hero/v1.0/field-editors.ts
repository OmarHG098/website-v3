/**
 * Field Editor Configuration for Hero Component
 * 
 * Defines which fields in this component should use special editors
 * in the Props tab of the section editor panel.
 * 
 * EditorType options: "icon-picker" | "color-picker" | "image-picker" | "link-picker"
 * 
 * Variant-specific fields use the format: "variantName:fieldPath"
 * Example: "productShowcase:left_images[].src" only applies to productShowcase variant
 */

export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  // Global - applies to all variants that have this field
  "signup_card.features[].icon": "icon-picker",
  "image.src": "image-picker",
  
  // Variant-specific - prefixed with variant name
  "productShowcase:left_images[].src": "image-picker",
  "productShowcase:right_images[].src": "image-picker",
  "showcase:left_images[].src": "image-picker",
  "showcase:right_images[].src": "image-picker",
  "simpleTwoColumn:image.src": "image-picker",
};
