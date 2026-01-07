import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";

interface IconPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValue?: string;
  onSelect: (iconName: string) => void;
  itemLabel?: string;
}

export function IconPickerModal({
  open,
  onOpenChange,
  currentValue,
  onSelect,
  itemLabel,
}: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [iconList, setIconList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch icon list from theme
  useEffect(() => {
    if (open && iconList.length === 0) {
      setLoading(true);
      fetch("/api/theme")
        .then((res) => res.json())
        .then((data) => {
          if (data.icons && Array.isArray(data.icons)) {
            setIconList(data.icons);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, iconList.length]);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return iconList;
    }
    const searchLower = search.toLowerCase();
    return iconList.filter((name) =>
      name.toLowerCase().includes(searchLower)
    );
  }, [search, iconList]);

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    onOpenChange(false);
    setSearch("");
  };

  const renderIcon = (iconName: string) => {
    // Handle both short names (Rocket) and full names (IconRocket)
    const fullName = iconName.startsWith("Icon") ? iconName : `Icon${iconName}`;
    const IconComponent = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[fullName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {currentValue && itemLabel 
              ? `Replacing ${currentValue.replace("Icon", "")} for ${itemLabel}`
              : "Select Icon"
            }
          </DialogTitle>
          <DialogDescription>
            Choose an icon from the list below
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-icon-search"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[300px] border rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-1 p-2">
              {filteredIcons.map((iconName) => {
                const isSelected = currentValue === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleSelect(iconName)}
                    className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    title={iconName.replace("Icon", "")}
                    data-testid={`icon-option-${iconName}`}
                  >
                    {renderIcon(iconName)}
                  </button>
                );
              })}
            </div>
          )}
          {!loading && filteredIcons.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No icons found
            </div>
          )}
        </ScrollArea>

        <p className="text-xs text-muted-foreground">
          Showing {filteredIcons.length} of {iconList.length} icons.
          {search && " Clear search to see all."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
