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
          <div className="flex-1 h-px bg-muted/50 group-hover:bg-primary/30 transition-colors duration-200" />
          <button
            onClick={handleOpenModal}
            className="mx-2 flex items-center justify-center rounded-full border border-dashed border-muted-foreground/20 text-muted-foreground/40 bg-background/80 transition-all duration-200 scale-75 opacity-60 group-hover:scale-100 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 group-hover:px-4 group-hover:py-2 group-hover:gap-2 p-1.5"
            data-testid={`button-add-section-${insertIndex}`}
          >
            <IconPlus className="h-3.5 w-3.5 group-hover:h-4 group-hover:w-4 transition-all duration-200" />
            <span className="text-sm font-medium hidden group-hover:inline">Add Section</span>
          </button>
          <div className="flex-1 h-px bg-muted/50 group-hover:bg-primary/30 transition-colors duration-200" />
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
