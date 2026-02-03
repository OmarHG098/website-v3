import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconSearch, IconQuestionMark, IconLoader2 } from "@tabler/icons-react";
import { getIcon, getAllIconNames, getIconDisplayName, isCustomIcon } from "@/lib/icons";

interface IconPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValue?: string;
  onSelect: (iconName: string) => void;
  itemLabel?: string;
}

const ICONS_PER_PAGE = 60;

const allIconNames = getAllIconNames();

export function IconPickerModal({
  open,
  onOpenChange,
  currentValue,
  onSelect,
  itemLabel,
}: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ICONS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return allIconNames;
    }
    const searchLower = search.toLowerCase();
    return allIconNames.filter((name) =>
      name.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const visibleIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleCount);
  }, [filteredIcons, visibleCount]);

  const hasMore = visibleCount < filteredIcons.length;

  useEffect(() => {
    setVisibleCount(ICONS_PER_PAGE);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setVisibleCount(ICONS_PER_PAGE);
      setSearch("");
    }
  }, [open]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ICONS_PER_PAGE, filteredIcons.length));
      setIsLoadingMore(false);
    }, 100);
  }, [hasMore, isLoadingMore, filteredIcons.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    onOpenChange(false);
    setSearch("");
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = getIcon(iconName);
    if (!IconComponent) return <IconQuestionMark className="h-5 w-5 text-muted-foreground" />;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {currentValue && itemLabel 
              ? `Reemplazando ${currentValue.replace("Icon", "")} para ${itemLabel}`
              : "Seleccionar Icono"
            }
          </DialogTitle>
          <DialogDescription>
            Elige un icono de la lista
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar iconos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-icon-search"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[350px] border rounded-md" ref={scrollContainerRef}>
          <div className="grid grid-cols-6 gap-1 p-2">
            {visibleIcons.map((iconName) => {
              const isSelected = currentValue === iconName;
              const isCustom = isCustomIcon(iconName);
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleSelect(iconName)}
                  className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  } ${isCustom ? "ring-1 ring-primary/30" : ""}`}
                  title={`${getIconDisplayName(iconName)}${isCustom ? " (personalizado)" : ""}`}
                  data-testid={`icon-option-${iconName}`}
                >
                  {renderIcon(iconName)}
                </button>
              );
            })}
          </div>
          
          {hasMore && (
            <div 
              ref={loadMoreRef} 
              className="flex items-center justify-center py-4"
            >
              {isLoadingMore ? (
                <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Desplázate para cargar más...
                </span>
              )}
            </div>
          )}
          
          {filteredIcons.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-8">
              No se encontraron iconos
            </div>
          )}
        </ScrollArea>

        <p className="text-xs text-muted-foreground">
          Mostrando {visibleIcons.length} de {filteredIcons.length} iconos
          {filteredIcons.length !== allIconNames.length && ` (${allIconNames.length} total)`}.
          {search && " Limpia la búsqueda para ver todos."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
