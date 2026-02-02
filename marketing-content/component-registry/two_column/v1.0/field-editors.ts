export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "image-with-style-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "left.image": "image-with-style-picker",
  "right.image": "image-with-style-picker",
  "left.bullets[].icon": "icon-picker",
  "right.bullets[].icon": "icon-picker",
  "left.bullet_icon": "icon-picker",
  "right.bullet_icon": "icon-picker",
  "benefit_items[].icon": "icon-picker",
};
