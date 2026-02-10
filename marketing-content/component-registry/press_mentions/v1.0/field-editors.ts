export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";
export const fieldEditors: Record<string, EditorType> = {
  "default_box_color": "color-picker",
  "default_title_color": "color-picker",
  "default_excerpt_color": "color-picker",
  "default_link_color": "color-picker",
  "title_color": "color-picker",
  "subtitle_color": "color-picker",
  "background": "color-picker",
  "items[].box_color": "color-picker",
  "items[].title_color": "color-picker",
  "items[].excerpt_color": "color-picker",
  "items[].link_color": "color-picker",
  "items[].logo": "image-picker",
  "items[].link_url": "link-picker",
};
