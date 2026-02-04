import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconRefresh,
  IconPlus,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconGripVertical,
  IconMenu2,
  IconLink,
  IconCode,
  IconEye,
} from "@tabler/icons-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navbar, type NavbarConfig } from "@/components/menus";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MenuItemData {
  label: string;
  href: string;
  component: string;
  dropdown?: {
    type: string;
    title?: string;
    description?: string;
    icon?: string;
    items?: Array<{
      label?: string;
      title?: string;
      description?: string;
      cta?: string;
      href: string;
      icon?: string;
    }>;
    columns?: Array<{
      title: string;
      items: Array<{ label: string; href: string }>;
    }>;
    groups?: Array<{
      title: string;
      items: Array<{ label: string; href: string }>;
    }>;
    footer?: {
      text: string;
      linkText: string;
      href: string;
    };
  };
}

interface MenuData {
  navbar: {
    items: MenuItemData[];
  };
}

interface MenuResponse {
  name: string;
  data: MenuData;
}

const componentOptions = [
  { value: "SimpleLink", label: "Simple Link" },
  { value: "Dropdown", label: "Dropdown Menu" },
];

const dropdownTypes = [
  { value: "cards", label: "Cards" },
  { value: "columns", label: "Columns" },
  { value: "simple-list", label: "Simple List" },
  { value: "grouped-list", label: "Grouped List" },
];

function SortableMenuItemEditor({
  id,
  item,
  index,
  onUpdate,
  onDelete,
  isExpanded,
  onToggleExpand,
}: {
  id: string;
  item: MenuItemData;
  index: number;
  onUpdate: (index: number, item: MenuItemData) => void;
  onDelete: (index: number) => void;
  isExpanded: boolean;
  onToggleExpand: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-2">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            className="touch-none cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            data-testid={`button-drag-item-${index}`}
          >
            <IconGripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onToggleExpand(index)}
            className="flex items-center gap-2 flex-1 text-left"
            data-testid={`button-expand-item-${index}`}
          >
            {isExpanded ? (
              <IconChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <IconChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <IconMenu2 className="h-4 w-4 text-primary" />
            <span className="font-medium">{item.label || "Untitled"}</span>
          </button>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {item.component}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(index)}
            className="h-8 w-8 text-destructive hover:text-destructive"
            data-testid={`button-delete-item-${index}`}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`label-${index}`}>Label</Label>
              <Input
                id={`label-${index}`}
                value={item.label}
                onChange={(e) => onUpdate(index, { ...item, label: e.target.value })}
                placeholder="Menu label"
                data-testid={`input-label-${index}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`href-${index}`}>URL</Label>
              <div className="relative">
                <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`href-${index}`}
                  value={item.href}
                  onChange={(e) => onUpdate(index, { ...item, href: e.target.value })}
                  placeholder="/page-url"
                  className="pl-9"
                  data-testid={`input-href-${index}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${index}`}>Component</Label>
              <Select
                value={item.component}
                onValueChange={(value) => {
                  const updatedItem = { ...item, component: value };
                  if (value === "Dropdown" && !item.dropdown) {
                    updatedItem.dropdown = {
                      type: "simple-list",
                      title: item.label,
                      description: "",
                      items: [],
                    };
                  }
                  onUpdate(index, updatedItem);
                }}
              >
                <SelectTrigger data-testid={`select-component-${index}`}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {componentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <IconCode className="h-4 w-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dropdown Type</Label>
              <Select
                value={item.dropdown?.type || "simple-list"}
                onValueChange={(value) =>
                  onUpdate(index, {
                    ...item,
                    dropdown: { ...item.dropdown!, type: value },
                  })
                }
                disabled={item.component !== "Dropdown"}
              >
                <SelectTrigger data-testid={`select-dropdown-type-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dropdownTypes.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value}>
                      {dt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {item.component === "Dropdown" && item.dropdown && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Dropdown Configuration</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={item.dropdown.title || ""}
                    onChange={(e) =>
                      onUpdate(index, {
                        ...item,
                        dropdown: { ...item.dropdown!, title: e.target.value },
                      })
                    }
                    placeholder="Dropdown title"
                    data-testid={`input-dropdown-title-${index}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.dropdown.description || ""}
                    onChange={(e) =>
                      onUpdate(index, {
                        ...item,
                        dropdown: { ...item.dropdown!, description: e.target.value },
                      })
                    }
                    placeholder="Dropdown description"
                    data-testid={`input-dropdown-description-${index}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input
                    value={item.dropdown.icon || ""}
                    onChange={(e) =>
                      onUpdate(index, {
                        ...item,
                        dropdown: { ...item.dropdown!, icon: e.target.value },
                      })
                    }
                    placeholder="icon-name"
                    data-testid={`input-dropdown-icon-${index}`}
                  />
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">
                  For complex dropdown items (cards, columns, groups), edit the YAML file directly for now.
                  Full visual editing coming soon.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function MenuEditor() {
  const params = useParams<{ menuName: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const menuName = params.menuName || "";

  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<MenuResponse>({
    queryKey: ["/api/menus", menuName],
    enabled: !!menuName,
  });

  useEffect(() => {
    if (data?.data) {
      setMenuData(data.data);
      setHasChanges(false);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (updatedData: MenuData) => {
      return apiRequest("POST", `/api/menus/${menuName}`, { data: updatedData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menus", menuName] });
      queryClient.invalidateQueries({ queryKey: ["/api/menus"] });
      queryClient.refetchQueries({ queryKey: ["/api/menus", menuName] });
      setHasChanges(false);
      toast({
        title: "Menu saved",
        description: "Changes saved! Refresh the homepage to see updates in the navbar.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving menu",
        description: error instanceof Error ? error.message : "Failed to save menu",
        variant: "destructive",
      });
    },
  });

  const handleUpdateItem = (index: number, updatedItem: MenuItemData) => {
    if (!menuData) return;
    const newItems = [...menuData.navbar.items];
    newItems[index] = updatedItem;
    setMenuData({ ...menuData, navbar: { ...menuData.navbar, items: newItems } });
    setHasChanges(true);
  };

  const handleDeleteItem = (index: number) => {
    if (!menuData) return;
    const newItems = menuData.navbar.items.filter((_, i) => i !== index);
    setMenuData({ ...menuData, navbar: { ...menuData.navbar, items: newItems } });
    setHasChanges(true);
    setConfirmDeleteIndex(null);
  };

  const handleAddItem = () => {
    if (!menuData) return;
    const newItem: MenuItemData = {
      label: "NEW ITEM",
      href: "/new-page",
      component: "SimpleLink",
    };
    const newItems = [...menuData.navbar.items, newItem];
    setMenuData({ ...menuData, navbar: { ...menuData.navbar, items: newItems } });
    setExpandedItems(new Set([...Array.from(expandedItems), newItems.length - 1]));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!menuData) return;
    saveMutation.mutate(menuData);
  };

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!menuData || !over || active.id === over.id) return;

    const oldIndex = menuData.navbar.items.findIndex((_, i) => `item-${i}` === active.id);
    const newIndex = menuData.navbar.items.findIndex((_, i) => `item-${i}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(menuData.navbar.items, oldIndex, newIndex);
      setMenuData({ ...menuData, navbar: { ...menuData.navbar, items: newItems } });
      setHasChanges(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load menu</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="button-back"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <IconMenu2 className="h-5 w-5 text-primary" />
                {menuName}
              </h1>
              <p className="text-sm text-muted-foreground">Menu Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveMutation.isPending}
              data-testid="button-save-menu"
            >
              {saveMutation.isPending ? (
                <IconRefresh className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="py-3 px-4">
              <div className="flex items-center gap-2">
                <IconEye className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-4 px-6 bg-background border-t">
              <div className="flex justify-center">
                <Navbar config={menuData as NavbarConfig} />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Menu Items ({menuData.navbar.items.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              data-testid="button-add-item"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={menuData.navbar.items.map((_, i) => `item-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                {menuData.navbar.items.map((item, index) => (
                  <SortableMenuItemEditor
                    key={`item-${index}`}
                    id={`item-${index}`}
                    item={item}
                    index={index}
                    onUpdate={handleUpdateItem}
                    onDelete={(idx) => setConfirmDeleteIndex(idx)}
                    isExpanded={expandedItems.has(index)}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {menuData.navbar.items.length === 0 && (
              <div className="text-center py-12">
                <IconMenu2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No menu items yet</p>
                <Button onClick={handleAddItem} data-testid="button-add-first-item">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </main>

      <Dialog open={confirmDeleteIndex !== null} onOpenChange={() => setConfirmDeleteIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteIndex(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteIndex !== null && handleDeleteItem(confirmDeleteIndex)}
              data-testid="button-confirm-delete"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
