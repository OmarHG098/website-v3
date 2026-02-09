export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";
export const fieldEditors: Record<string, EditorType> = {
  "default_box_color": "color-picker",
  "items[].box_color": "color-picker",
  "background": "color-picker",
};
