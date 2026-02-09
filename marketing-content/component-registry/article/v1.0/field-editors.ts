/**
 * Field Editor Configuration for Article Component
 */

export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "image-picker:logo" | "link-picker" | "text-input" | "rich-text-editor";

export const fieldEditors: Record<string, EditorType> = {
  "content": "rich-text-editor",
};
