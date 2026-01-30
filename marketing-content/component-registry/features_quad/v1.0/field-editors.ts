export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "cards[].icon": "icon-picker",
  "images[].image_id": "image-picker",
  "background": "color-picker",
};
