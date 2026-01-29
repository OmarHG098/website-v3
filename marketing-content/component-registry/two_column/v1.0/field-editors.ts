export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "left.image": "image-picker",
  "right.image": "image-picker",
  "left.bullets[].icon": "icon-picker",
  "right.bullets[].icon": "icon-picker",
  "left.bullet_icon": "icon-picker",
  "right.bullet_icon": "icon-picker",
  "benefit_items[].icon": "icon-picker",
};
