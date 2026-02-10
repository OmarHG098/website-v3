export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker" | "rich-text-editor";

export const fieldEditors: Record<string, EditorType> = {
  "description": "rich-text-editor",
};
