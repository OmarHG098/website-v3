export type EditorType = "icon-picker" | "color-picker" | "image-picker:logo" | "image-with-style-picker" | "link-picker" | "boolean-toggle";

export const fieldEditors: Record<string, EditorType> = {
  "tabs[].col1_boxes[].icon": "icon-picker",
  "tabs[].col2_bullets[].icon": "icon-picker",
  "tabs[].col3_image_id": "image-with-style-picker",
};
