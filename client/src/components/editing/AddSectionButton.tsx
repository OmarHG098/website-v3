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
          <div className="flex-1 h-px bg-transparent group-hover:bg-primary/30 transition-colors duration-200" />
          <button
            onClick={handleOpenModal}
            className="mx-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground bg-background hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 opacity-0 group-hover:opacity-100"
            data-testid={`button-add-section-${insertIndex}`}
          >
            <IconPlus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
          <div className="flex-1 h-px bg-transparent group-hover:bg-primary/30 transition-colors duration-200" />
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
