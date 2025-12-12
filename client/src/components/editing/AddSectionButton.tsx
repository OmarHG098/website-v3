import { useState, lazy, Suspense } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useEditModeOptional } from "@/contexts/EditModeContext";

const ComponentPickerModal = lazy(() => import("./ComponentPickerModal"));

interface AddSectionButtonProps {
  insertIndex: number;
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  onSectionAdded?: () => void;
}

export function AddSectionButton({ 
  insertIndex, 
  contentType, 
  slug, 
  locale,
  onSectionAdded 
}: AddSectionButtonProps) {
  const editMode = useEditModeOptional();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!editMode || !editMode.isEditMode) {
    return null;
  }
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSectionAdded = () => {
    setIsModalOpen(false);
    onSectionAdded?.();
  };
  
  return (
    <>
      <div 
        className="relative py-4 group"
        data-testid={`add-section-zone-${insertIndex}`}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex-1 h-px bg-border group-hover:bg-primary/40 transition-colors duration-200" />
          <button
            onClick={handleOpenModal}
            className="mx-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground/70 bg-background transition-all duration-200 group-hover:scale-105 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/10 group-hover:px-4 group-hover:py-2 group-hover:gap-2"
            data-testid={`button-add-section-${insertIndex}`}
          >
            <IconPlus className="h-4 w-4" />
            <span className="text-xs font-medium group-hover:text-sm transition-all duration-200">Add</span>
          </button>
          <div className="flex-1 h-px bg-border group-hover:bg-primary/40 transition-colors duration-200" />
        </div>
      </div>
      
      {isModalOpen && (
        <Suspense fallback={null}>
          <ComponentPickerModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            insertIndex={insertIndex}
            contentType={contentType}
            slug={slug}
            locale={locale}
            onSectionAdded={handleSectionAdded}
          />
        </Suspense>
      )}
    </>
  );
}
