export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "secondary.image_id": "image-picker",
  "primary.tool_icons[].image_id": "image-picker",
  "secondary.benefits[].icon": "icon-picker",
  "primary.tool_icons[].icon": "icon-picker",
};
