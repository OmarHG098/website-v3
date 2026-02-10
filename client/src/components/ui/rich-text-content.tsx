import { cn } from "@/lib/utils";

export interface RichTextContentProps {
  html: string;
  className?: string;
  "data-testid"?: string;
}

const defaultProseClasses =
  "prose max-w-none prose-p:mb-1 [&>div]:mt-1 prose-p:leading-relaxed " +
  "prose-a:text-primary prose-a:no-underline prose-a:[&:hover]:underline rich-text-bullets";

export function RichTextContent({
  html,
  className,
  "data-testid": testId,
}: RichTextContentProps) {
  if (!html?.trim()) return null;

  return (
    <div
      className={cn(defaultProseClasses, className)}
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid={testId}
    />
  );
}
