export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "image-with-style-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "slides[].image_id": "image-with-style-picker",
  "slides[].institution_logos[].image_id": "image-picker",
  "slides[].cta.icon": "icon-picker",
};
