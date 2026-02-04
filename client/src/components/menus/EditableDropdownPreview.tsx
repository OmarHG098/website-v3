import { useState } from "react";
import { ChevronRight, Code, BarChart3, Shield, Brain, Medal, GraduationCap, Building } from "lucide-react";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconLink,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  chart: BarChart3,
  shield: Shield,
  brain: Brain,
  medal: Medal,
  "graduation-cap": GraduationCap,
  building: Building,
};

const iconOptions = [
  { value: "code", label: "Code" },
  { value: "chart", label: "Chart" },
  { value: "shield", label: "Shield" },
  { value: "brain", label: "Brain" },
  { value: "medal", label: "Medal" },
  { value: "graduation-cap", label: "Graduation Cap" },
  { value: "building", label: "Building" },
];

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: "span" | "h3" | "h4" | "p" | "a";
  testId?: string;
}

function EditableText({ value, onChange, placeholder, className, as: Tag = "span", testId }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <Tag
          className={`group relative cursor-pointer inline-flex items-center gap-1 ${className || ""}`}
          onClick={() => {
            setTempValue(value);
            setIsEditing(true);
          }}
          data-testid={testId}
        >
          {value || <span className="text-muted-foreground italic">{placeholder}</span>}
          <IconPencil className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </Tag>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="flex gap-2">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            data-testid={testId ? `${testId}-input` : undefined}
          />
          <Button size="sm" className="h-8" onClick={handleSave} data-testid={testId ? `${testId}-save` : undefined}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface EditableLinkItemProps {
  label: string;
  href: string;
  onLabelChange: (label: string) => void;
  onHrefChange: (href: string) => void;
  onDelete: () => void;
  testIdPrefix: string;
}

function EditableLinkItem({ label, href, onLabelChange, onHrefChange, onDelete, testIdPrefix }: EditableLinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);
  const [tempHref, setTempHref] = useState(href);

  const handleSave = () => {
    onLabelChange(tempLabel);
    onHrefChange(tempHref);
    setIsEditing(false);
  };

  return (
    <div className="group/item flex items-center gap-1">
      <Popover open={isEditing} onOpenChange={(open) => {
        if (open) {
          setTempLabel(label);
          setTempHref(href);
        }
        setIsEditing(open);
      }}>
        <PopoverTrigger asChild>
          <button
            className="flex-1 flex items-center justify-between px-2 py-2 rounded-md text-sm text-foreground hover-elevate text-left"
            data-testid={`${testIdPrefix}-trigger`}
          >
            <span className="flex items-center gap-1">
              {label || <span className="text-muted-foreground italic">Item label</span>}
              <IconPencil className="h-3 w-3 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                placeholder="Item label"
                className="h-8 text-sm"
                autoFocus
                data-testid={`${testIdPrefix}-label-input`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <div className="relative">
                <IconLink className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={tempHref}
                  onChange={(e) => setTempHref(e.target.value)}
                  placeholder="/page-url"
                  className="h-8 text-sm pl-7"
                  data-testid={`${testIdPrefix}-href-input`}
                />
              </div>
            </div>
            <Button size="sm" className="w-full h-8" onClick={handleSave} data-testid={`${testIdPrefix}-save`}>
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <button
        onClick={onDelete}
        className="p-1 rounded-md text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity"
        data-testid={`${testIdPrefix}-delete`}
      >
        <IconTrash className="h-3 w-3" />
      </button>
    </div>
  );
}

interface EditableIconProps {
  value?: string;
  onChange: (value: string) => void;
  testId?: string;
}

function EditableIcon({ value, onChange, testId }: EditableIconProps) {
  const [isEditing, setIsEditing] = useState(false);
  const IconComponent = value ? iconMap[value] : null;

  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <div 
          className="group relative cursor-pointer w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary"
          data-testid={testId}
        >
          {IconComponent ? (
            <IconComponent className="w-6 h-6" />
          ) : (
            <IconPlus className="w-6 h-6 opacity-50" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <IconPencil className="h-4 w-4 text-primary" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map((icon) => {
            const Icon = iconMap[icon.value];
            return (
              <button
                key={icon.value}
                onClick={() => {
                  onChange(icon.value);
                  setIsEditing(false);
                }}
                className={`p-2 rounded-md hover-elevate ${value === icon.value ? "bg-primary/20" : ""}`}
                title={icon.label}
                data-testid={testId ? `${testId}-option-${icon.value}` : undefined}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CardItem {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon?: string;
}

interface ColumnItem {
  label: string;
  href: string;
}

interface Column {
  title: string;
  items: ColumnItem[];
}

interface GroupItem {
  label: string;
  href: string;
}

interface Group {
  title: string;
  items: GroupItem[];
}

interface CardsDropdownData {
  type: "cards";
  title?: string;
  description?: string;
  items?: CardItem[];
  footer?: {
    text: string;
    linkText?: string;
    href: string;
  };
}

interface ColumnsDropdownData {
  type: "columns";
  title?: string;
  description?: string;
  icon?: string;
  columns?: Column[];
}

interface SimpleListDropdownData {
  type: "simple-list";
  title?: string;
  description?: string;
  icon?: string;
  items?: ColumnItem[];
}

interface GroupedListDropdownData {
  type: "grouped-list";
  title?: string;
  description?: string;
  icon?: string;
  groups?: Group[];
}

type DropdownData = CardsDropdownData | ColumnsDropdownData | SimpleListDropdownData | GroupedListDropdownData;

interface EditableDropdownPreviewProps {
  dropdown: DropdownData;
  onChange: (dropdown: DropdownData) => void;
}

function EditableCardItem({
  item,
  index,
  onUpdate,
  onDelete,
}: {
  item: CardItem;
  index: number;
  onUpdate: (updates: Partial<CardItem>) => void;
  onDelete: () => void;
}) {
  const [isEditingHref, setIsEditingHref] = useState(false);
  const [tempHref, setTempHref] = useState(item.href);

  return (
    <div className="group/card relative block rounded-lg p-3 border border-transparent hover:border-border">
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 p-1 rounded-md bg-destructive/10 text-destructive opacity-0 group-hover/card:opacity-100 transition-opacity"
        data-testid={`editable-card-${index}-delete`}
      >
        <IconTrash className="h-3 w-3" />
      </button>
      
      <div className="mb-3">
        <EditableIcon
          value={item.icon}
          onChange={(icon) => onUpdate({ icon })}
          testId={`editable-card-${index}-icon`}
        />
      </div>
      <EditableText
        value={item.title}
        onChange={(title) => onUpdate({ title })}
        placeholder="Card title"
        className="font-semibold text-foreground mb-2 block"
        as="h4"
        testId={`editable-card-${index}-title`}
      />
      <EditableText
        value={item.description}
        onChange={(description) => onUpdate({ description })}
        placeholder="Card description"
        className="text-sm text-muted-foreground mb-3 block line-clamp-3"
        as="p"
        testId={`editable-card-${index}-description`}
      />
      <EditableText
        value={item.cta}
        onChange={(cta) => onUpdate({ cta })}
        placeholder="CTA text"
        className="inline-flex items-center text-sm font-medium border border-border rounded-md px-3 py-1.5"
        testId={`editable-card-${index}-cta`}
      />
      
      <Popover open={isEditingHref} onOpenChange={(open) => {
        if (open) setTempHref(item.href);
        setIsEditingHref(open);
      }}>
        <PopoverTrigger asChild>
          <button 
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            data-testid={`editable-card-${index}-href-trigger`}
          >
            <IconLink className="h-3 w-3" />
            {item.href || "/page-url"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="flex gap-2">
            <Input
              value={tempHref}
              onChange={(e) => setTempHref(e.target.value)}
              placeholder="/page-url"
              className="h-8 text-sm"
              autoFocus
              data-testid={`editable-card-${index}-href-input`}
            />
            <Button 
              size="sm" 
              className="h-8" 
              onClick={() => {
                onUpdate({ href: tempHref });
                setIsEditingHref(false);
              }}
              data-testid={`editable-card-${index}-href-save`}
            >
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function EditableCardsPreview({ 
  dropdown, 
  onChange 
}: { 
  dropdown: CardsDropdownData; 
  onChange: (dropdown: CardsDropdownData) => void;
}) {
  const items = dropdown.items || [];

  const updateItem = (index: number, updates: Partial<CardItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...dropdown, items: newItems });
  };

  const addItem = () => {
    const newItem: CardItem = {
      title: "New Card",
      description: "Card description",
      cta: "Learn More",
      href: "/new-page",
      icon: "code",
    };
    onChange({ ...dropdown, items: [...items, newItem] });
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...dropdown, items: newItems });
  };

  return (
    <div className="p-6 bg-popover border border-border rounded-lg">
      <div className="mb-6">
        <EditableText
          value={dropdown.title || ""}
          onChange={(title) => onChange({ ...dropdown, title })}
          placeholder="Dropdown Title"
          className="text-lg font-semibold text-foreground mb-1 block"
          as="h3"
          testId="editable-cards-title"
        />
        <EditableText
          value={dropdown.description || ""}
          onChange={(description) => onChange({ ...dropdown, description })}
          placeholder="Dropdown description"
          className="text-sm text-muted-foreground block"
          as="p"
          testId="editable-cards-description"
        />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <EditableCardItem
            key={index}
            item={item}
            index={index}
            onUpdate={(updates) => updateItem(index, updates)}
            onDelete={() => deleteItem(index)}
          />
        ))}
        
        <button
          onClick={addItem}
          className="flex flex-col items-center justify-center rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors min-h-[200px]"
          data-testid="editable-cards-add"
        >
          <IconPlus className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Add Card</span>
        </button>
      </div>
    </div>
  );
}

function EditableSimpleListPreview({
  dropdown,
  onChange,
}: {
  dropdown: SimpleListDropdownData;
  onChange: (dropdown: SimpleListDropdownData) => void;
}) {
  const items = dropdown.items || [];

  const updateItem = (index: number, updates: Partial<ColumnItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...dropdown, items: newItems });
  };

  const addItem = () => {
    const newItem: ColumnItem = { label: "New Item", href: "/new-page" };
    onChange({ ...dropdown, items: [...items, newItem] });
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...dropdown, items: newItems });
  };

  return (
    <div className="w-80 p-4 bg-popover border border-border rounded-lg">
      <div className="flex items-start gap-3 mb-4 pb-4 border-b">
        <EditableIcon
          value={dropdown.icon}
          onChange={(icon) => onChange({ ...dropdown, icon })}
          testId="editable-simple-list-icon"
        />
        <div className="flex-1">
          <EditableText
            value={dropdown.title || ""}
            onChange={(title) => onChange({ ...dropdown, title })}
            placeholder="Dropdown title"
            className="font-semibold text-foreground block"
            as="h3"
            testId="editable-simple-list-title"
          />
          <EditableText
            value={dropdown.description || ""}
            onChange={(description) => onChange({ ...dropdown, description })}
            placeholder="Description"
            className="text-xs text-muted-foreground mt-1 block"
            as="p"
            testId="editable-simple-list-description"
          />
        </div>
      </div>
      
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <EditableLinkItem
              label={item.label || ""}
              href={item.href || ""}
              onLabelChange={(label) => updateItem(index, { label })}
              onHrefChange={(href) => updateItem(index, { href })}
              onDelete={() => deleteItem(index)}
              testIdPrefix={`editable-simple-list-item-${index}`}
            />
          </li>
        ))}
      </ul>
      
      <button
        onClick={addItem}
        className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
        data-testid="editable-simple-list-add"
      >
        <IconPlus className="h-4 w-4" />
        Add Item
      </button>
    </div>
  );
}

function EditableColumnsPreview({
  dropdown,
  onChange,
}: {
  dropdown: ColumnsDropdownData;
  onChange: (dropdown: ColumnsDropdownData) => void;
}) {
  const columns = dropdown.columns || [];

  const updateColumn = (colIndex: number, updates: Partial<Column>) => {
    const newColumns = [...columns];
    newColumns[colIndex] = { ...newColumns[colIndex], ...updates };
    onChange({ ...dropdown, columns: newColumns });
  };

  const updateColumnItem = (colIndex: number, itemIndex: number, updates: Partial<ColumnItem>) => {
    const newColumns = [...columns];
    const newItems = [...(newColumns[colIndex].items || [])];
    newItems[itemIndex] = { ...newItems[itemIndex], ...updates };
    newColumns[colIndex] = { ...newColumns[colIndex], items: newItems };
    onChange({ ...dropdown, columns: newColumns });
  };

  const addColumnItem = (colIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex] = {
      ...newColumns[colIndex],
      items: [...(newColumns[colIndex].items || []), { label: "New Item", href: "/new-page" }],
    };
    onChange({ ...dropdown, columns: newColumns });
  };

  const deleteColumnItem = (colIndex: number, itemIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex] = {
      ...newColumns[colIndex],
      items: (newColumns[colIndex].items || []).filter((_, i) => i !== itemIndex),
    };
    onChange({ ...dropdown, columns: newColumns });
  };

  const addColumn = () => {
    onChange({
      ...dropdown,
      columns: [...columns, { title: "New Column", items: [] }],
    });
  };

  const deleteColumn = (colIndex: number) => {
    onChange({
      ...dropdown,
      columns: columns.filter((_, i) => i !== colIndex),
    });
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-popover border border-border rounded-lg">
      <div className="flex items-start gap-4 mb-6 pb-4 border-b">
        <EditableIcon
          value={dropdown.icon}
          onChange={(icon) => onChange({ ...dropdown, icon })}
          testId="editable-columns-icon"
        />
        <div className="flex-1">
          <EditableText
            value={dropdown.title || ""}
            onChange={(title) => onChange({ ...dropdown, title })}
            placeholder="Dropdown title"
            className="flex items-center gap-1 text-lg font-semibold text-foreground"
            as="h3"
            testId="editable-columns-title"
          />
          <EditableText
            value={dropdown.description || ""}
            onChange={(description) => onChange({ ...dropdown, description })}
            placeholder="Description"
            className="text-sm text-muted-foreground mt-1 block"
            as="p"
            testId="editable-columns-description"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="group/col relative">
            <button
              onClick={() => deleteColumn(colIndex)}
              className="absolute -top-2 -right-2 p-1 rounded-md bg-destructive/10 text-destructive opacity-0 group-hover/col:opacity-100 transition-opacity z-10"
              data-testid={`editable-column-${colIndex}-delete`}
            >
              <IconTrash className="h-3 w-3" />
            </button>
            
            <EditableText
              value={column.title}
              onChange={(title) => updateColumn(colIndex, { title })}
              placeholder="Column title"
              className="font-semibold text-foreground mb-3 block"
              as="h4"
              testId={`editable-column-${colIndex}-title`}
            />
            <ul className="space-y-2">
              {(column.items || []).map((item, itemIndex) => (
                <li key={itemIndex}>
                  <EditableLinkItem
                    label={item.label || ""}
                    href={item.href || ""}
                    onLabelChange={(label) => updateColumnItem(colIndex, itemIndex, { label })}
                    onHrefChange={(href) => updateColumnItem(colIndex, itemIndex, { href })}
                    onDelete={() => deleteColumnItem(colIndex, itemIndex)}
                    testIdPrefix={`editable-column-${colIndex}-item-${itemIndex}`}
                  />
                </li>
              ))}
              <li>
                <button
                  onClick={() => addColumnItem(colIndex)}
                  className="flex items-center gap-1 text-sm text-muted-foreground/50 hover:text-primary"
                  data-testid={`editable-column-${colIndex}-add-item`}
                >
                  <IconPlus className="h-3 w-3" />
                  Add item
                </button>
              </li>
            </ul>
          </div>
        ))}
        
        <button
          onClick={addColumn}
          className="flex flex-col items-center justify-center rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors min-h-[120px]"
          data-testid="editable-columns-add-column"
        >
          <IconPlus className="h-6 w-6 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">Add Column</span>
        </button>
      </div>
    </div>
  );
}

function EditableGroupedListPreview({
  dropdown,
  onChange,
}: {
  dropdown: GroupedListDropdownData;
  onChange: (dropdown: GroupedListDropdownData) => void;
}) {
  const groups = dropdown.groups || [];
  const [activeGroup, setActiveGroup] = useState(0);

  const updateGroup = (groupIndex: number, updates: Partial<Group>) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = { ...newGroups[groupIndex], ...updates };
    onChange({ ...dropdown, groups: newGroups });
  };

  const updateGroupItem = (groupIndex: number, itemIndex: number, updates: Partial<GroupItem>) => {
    const newGroups = [...groups];
    const newItems = [...(newGroups[groupIndex].items || [])];
    newItems[itemIndex] = { ...newItems[itemIndex], ...updates };
    newGroups[groupIndex] = { ...newGroups[groupIndex], items: newItems };
    onChange({ ...dropdown, groups: newGroups });
  };

  const addGroupItem = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      items: [...(newGroups[groupIndex].items || []), { label: "New Item", href: "/new-page" }],
    };
    onChange({ ...dropdown, groups: newGroups });
  };

  const deleteGroupItem = (groupIndex: number, itemIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      items: (newGroups[groupIndex].items || []).filter((_, i) => i !== itemIndex),
    };
    onChange({ ...dropdown, groups: newGroups });
  };

  const addGroup = () => {
    onChange({
      ...dropdown,
      groups: [...groups, { title: "New Group", items: [] }],
    });
  };

  const deleteGroup = (groupIndex: number) => {
    const newGroups = groups.filter((_, i) => i !== groupIndex);
    onChange({ ...dropdown, groups: newGroups });
    if (activeGroup >= newGroups.length) {
      setActiveGroup(Math.max(0, newGroups.length - 1));
    }
  };

  return (
    <div className="w-full max-w-xl p-4 bg-popover border border-border rounded-lg">
      <div className="flex items-start gap-3 mb-4 pb-4 border-b">
        <EditableIcon
          value={dropdown.icon}
          onChange={(icon) => onChange({ ...dropdown, icon })}
          testId="editable-grouped-list-icon"
        />
        <div className="flex-1">
          <EditableText
            value={dropdown.title || ""}
            onChange={(title) => onChange({ ...dropdown, title })}
            placeholder="Dropdown title"
            className="font-semibold text-foreground block"
            as="h3"
            testId="editable-grouped-list-title"
          />
          <EditableText
            value={dropdown.description || ""}
            onChange={(description) => onChange({ ...dropdown, description })}
            placeholder="Description"
            className="text-xs text-muted-foreground mt-1 block"
            as="p"
            testId="editable-grouped-list-description"
          />
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="w-32 flex-shrink-0 space-y-1">
          {groups.map((group, index) => (
            <div key={index} className="group/tab relative flex items-center">
              <button
                onClick={() => setActiveGroup(index)}
                className={`flex-1 text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  activeGroup === index
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover-elevate"
                }`}
                data-testid={`editable-group-tab-${index}`}
              >
                <EditableText
                  value={group.title}
                  onChange={(title) => updateGroup(index, { title })}
                  placeholder="Group"
                  testId={`editable-group-${index}-title`}
                />
              </button>
              <button
                onClick={() => deleteGroup(index)}
                className="absolute right-0 p-1 text-destructive opacity-0 group-hover/tab:opacity-100"
                data-testid={`editable-group-${index}-delete`}
              >
                <IconTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={addGroup}
            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-md hover:border-primary/50"
            data-testid="editable-grouped-list-add-group"
          >
            <IconPlus className="h-3 w-3" />
            Add
          </button>
        </div>
        
        <div className="flex-1">
          {groups.length > 0 && groups[activeGroup] ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {(groups[activeGroup].items || []).map((item, index) => (
                <EditableLinkItem
                  key={index}
                  label={item.label || ""}
                  href={item.href || ""}
                  onLabelChange={(label) => updateGroupItem(activeGroup, index, { label })}
                  onHrefChange={(href) => updateGroupItem(activeGroup, index, { href })}
                  onDelete={() => deleteGroupItem(activeGroup, index)}
                  testIdPrefix={`editable-group-${activeGroup}-item-${index}`}
                />
              ))}
              <button
                onClick={() => addGroupItem(activeGroup)}
                className="flex items-center gap-1 py-1.5 text-sm text-muted-foreground/50 hover:text-primary"
                data-testid={`editable-group-${activeGroup}-add-item`}
              >
                <IconPlus className="h-3 w-3" />
                Add item
              </button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              Add a group to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EditableDropdownPreview({ dropdown, onChange }: EditableDropdownPreviewProps) {
  switch (dropdown.type) {
    case "cards":
      return (
        <EditableCardsPreview
          dropdown={dropdown}
          onChange={onChange as (d: CardsDropdownData) => void}
        />
      );
    case "simple-list":
      return (
        <EditableSimpleListPreview
          dropdown={dropdown}
          onChange={onChange as (d: SimpleListDropdownData) => void}
        />
      );
    case "columns":
      return (
        <EditableColumnsPreview
          dropdown={dropdown}
          onChange={onChange as (d: ColumnsDropdownData) => void}
        />
      );
    case "grouped-list":
      return (
        <EditableGroupedListPreview
          dropdown={dropdown}
          onChange={onChange as (d: GroupedListDropdownData) => void}
        />
      );
    default:
      return (
        <div className="p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
          Unknown dropdown type. Select a dropdown type above.
        </div>
      );
  }
}
