export type EditorType = "icon-picker" | "color-picker:courses" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "courses[].course_background": "color-picker:courses",
  "courses[].badges[].icon": "icon-picker",
  "courses[].tags[].icon": "icon-picker",
  "courses[].cta_url": "link-picker",
};
