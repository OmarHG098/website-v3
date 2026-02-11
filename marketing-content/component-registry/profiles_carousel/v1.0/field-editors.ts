export type EditorType = "icon-picker" | "color-picker" | "image-picker:logo" | "image-with-style-picker" | "link-picker" | "boolean-toggle";

export const fieldEditors: Record<string, EditorType> = {
  "profiles[].image_id": "image-with-style-picker",
  "profiles[].image_round": "boolean-toggle",
  "profiles[].linkedin_url": "link-picker",
};
