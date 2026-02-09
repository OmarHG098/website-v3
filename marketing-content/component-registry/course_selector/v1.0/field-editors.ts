export type EditorType = "icon-picker" | "color-picker:courses" | "color-picker:accent" | "image-picker" | "link-picker";

export const fieldEditors: Record<string, EditorType> = {
  "courses[].icon": "icon-picker",
  "courses[].badges[].icon": "icon-picker",
  "courses[].tags[].icon": "icon-picker",
  "courses[].cta_url": "link-picker",

  "default:courses[].course_background":  "color-picker:courses",
  "solid:courses[].course_background": "color-picker:accent"
};
