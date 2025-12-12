import { useCallback } from "react";
import { IconPencil, IconGripVertical } from "@tabler/icons-react";
import type { Section } from "@shared/schema";
import { useEditModeOptional } from "@/contexts/EditModeContext";

interface EditableSectionProps {
  children: React.ReactNode;
  section: Section;
  index: number;
  sectionType: string;
}

export function EditableSection({ children, section, index, sectionType }: EditableSectionProps) {
  const editMode = useEditModeOptional();
  
  // If not in edit mode context or edit mode is not active, render children directly
  if (!editMode || !editMode.isEditMode) {
    return <>{children}</>;
  }
  
  const { selectedSectionIndex, setSelectedSectionIndex } = editMode;
  const isSelected = selectedSectionIndex === index;
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSectionIndex(index);
  }, [index, setSelectedSectionIndex]);
  
  return (
    <div 
      className="relative group"
      data-edit-section-index={index}
      data-edit-section-type={sectionType}
    >
      {/* Edit overlay - only visible on hover when in edit mode */}
      <div 
        className={`
          absolute inset-0 z-40 pointer-events-none transition-all duration-150
          ${isSelected 
            ? "ring-2 ring-primary ring-offset-2" 
            : "group-hover:ring-2 group-hover:ring-primary/50 group-hover:ring-offset-1"
          }
        `}
      />
      
      {/* Edit controls - visible on hover */}
      <div 
        className={`
          absolute top-2 right-2 z-50 flex items-center gap-1 
          transition-opacity duration-150
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        <button
          onClick={handleClick}
          className="p-2 bg-primary text-primary-foreground rounded-md shadow-lg hover-elevate flex items-center gap-1.5"
          data-testid={`button-edit-section-${index}`}
        >
          <IconPencil className="h-4 w-4" />
          <span className="text-xs font-medium">{sectionType}</span>
        </button>
        <button
          className="p-2 bg-muted text-muted-foreground rounded-md shadow-lg hover-elevate cursor-grab"
          data-testid={`button-drag-section-${index}`}
        >
          <IconGripVertical className="h-4 w-4" />
        </button>
      </div>
      
      {/* Section label - bottom left */}
      <div 
        className={`
          absolute bottom-2 left-2 z-50 
          px-2 py-1 bg-muted/90 backdrop-blur-sm rounded text-xs text-muted-foreground
          transition-opacity duration-150
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        Section {index + 1}
      </div>
      
      {/* Content with pointer events enabled */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
