import { useState, useRef } from "react";
import { ChevronDown, ChevronRight, Code, BarChart3, Shield, Brain, Medal, GraduationCap, Building } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  chart: BarChart3,
  shield: Shield,
  brain: Brain,
  medal: Medal,
  "graduation-cap": GraduationCap,
  building: Building,
};

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
  items: CardItem[];
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
  columns: Column[];
}

interface SimpleListDropdownData {
  type: "simple-list";
  title?: string;
  description?: string;
  icon?: string;
  items: ColumnItem[];
}

interface GroupedListDropdownData {
  type: "grouped-list";
  title?: string;
  description?: string;
  icon?: string;
  groups: Group[];
}

type DropdownData = CardsDropdownData | ColumnsDropdownData | SimpleListDropdownData | GroupedListDropdownData;

export interface DropdownProps {
  label: string;
  href: string;
  dropdown: DropdownData;
}

function CardsDropdown({ dropdown }: { dropdown: CardsDropdownData }) {
  return (
    <div className="p-6">
      {(dropdown.title || dropdown.description) && (
        <div className="mb-6">
          {dropdown.title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">{dropdown.title}</h3>
          )}
          {dropdown.description && (
            <p className="text-sm text-muted-foreground">{dropdown.description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-6">
        {dropdown.items.map((item, index) => {
          const IconComponent = item.icon ? iconMap[item.icon] : null;
          return (
            <a
              key={index}
              href={item.href}
              className="block hover-elevate rounded-lg p-2 -m-2"
              data-testid={`dropdown-card-${(item.title || "card").toLowerCase().replace(/\s+/g, "-")}`}
            >
              {IconComponent && (
                <div className="mb-3 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="w-6 h-6" />
                </div>
              )}
              <h4 className="font-semibold text-foreground mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-4">
                {item.description}
              </p>
              <span className="inline-flex items-center text-sm font-medium border border-border rounded-md px-4 py-2 hover-elevate">
                {item.cta}
              </span>
            </a>
          );
        })}
      </div>
      
      {dropdown.footer && (
        <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
          {dropdown.footer.text}{" "}
          <a href={dropdown.footer.href} className="text-primary hover:underline">
            {dropdown.footer.linkText || "here"}
          </a>
          .
        </div>
      )}
    </div>
  );
}

function ColumnsDropdown({ dropdown }: { dropdown: ColumnsDropdownData }) {
  const IconComponent = dropdown.icon ? iconMap[dropdown.icon] : null;
  
  return (
    <div className="w-full max-w-4xl p-6">
      {(dropdown.title || dropdown.description) && (
        <div className="flex items-start gap-4 mb-6 pb-4 border-b">
          {IconComponent && (
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
          )}
          <div>
            {dropdown.title && (
              <a href="#" className="flex items-center gap-1 text-lg font-semibold text-foreground hover-elevate rounded-md">
                {dropdown.title}
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
            {dropdown.description && (
              <p className="text-sm text-muted-foreground mt-1">{dropdown.description}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {dropdown.columns.map((column, colIndex) => (
          <div key={colIndex}>
            <h4 className="font-semibold text-foreground mb-3">{column.title}</h4>
            <ul className="space-y-2">
              {column.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-1 -mx-1"
                    data-testid={`dropdown-column-item-${(item.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleListDropdown({ dropdown }: { dropdown: SimpleListDropdownData }) {
  const IconComponent = dropdown.icon ? iconMap[dropdown.icon] : null;
  
  return (
    <div className="p-4">
      {(dropdown.title || dropdown.description) && (
        <div className="flex items-start gap-3 mb-4 pb-4 border-b">
          {IconComponent && (
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
          )}
          <div>
            {dropdown.title && (
              <h3 className="font-semibold text-foreground">{dropdown.title}</h3>
            )}
            {dropdown.description && (
              <p className="text-xs text-muted-foreground mt-1">{dropdown.description}</p>
            )}
          </div>
        </div>
      )}
      
      <ul className="space-y-1">
        {dropdown.items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="flex items-center justify-between px-2 py-2 rounded-md text-sm text-foreground hover-elevate"
              data-testid={`dropdown-list-item-${(item.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item.label}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupedListDropdown({ dropdown }: { dropdown: GroupedListDropdownData }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const IconComponent = dropdown.icon ? iconMap[dropdown.icon] : null;
  
  return (
    <div className="w-full max-w-xl p-4">
      {(dropdown.title || dropdown.description) && (
        <div className="flex items-start gap-3 mb-4 pb-4 border-b">
          {IconComponent && (
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
          )}
          <div>
            {dropdown.title && (
              <h3 className="font-semibold text-foreground">{dropdown.title}</h3>
            )}
            {dropdown.description && (
              <p className="text-xs text-muted-foreground mt-1">{dropdown.description}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex gap-6">
        <div className="w-32 flex-shrink-0 space-y-1">
          {dropdown.groups.map((group, index) => (
            <button
              key={index}
              onClick={() => setActiveGroup(index)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors toggle-elevate ${
                activeGroup === index
                  ? "text-foreground bg-muted toggle-elevated"
                  : "text-muted-foreground"
              }`}
              data-testid={`dropdown-group-tab-${(group.title || "group").toLowerCase().replace(/\s+/g, "-")}`}
            >
              {group.title}
            </button>
          ))}
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {dropdown.groups[activeGroup]?.items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-1 py-1.5 text-sm text-muted-foreground hover-elevate rounded-md px-1 -mx-1"
                data-testid={`dropdown-group-item-${(item.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
                <ChevronRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dropdown({ label, href, dropdown }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isWideDropdown = dropdown.type === "cards" || dropdown.type === "columns";
  
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };
  
  const getDropdownWidth = () => {
    switch (dropdown.type) {
      case "cards":
        return "w-[900px]";
      case "columns":
        return "w-[800px]";
      case "simple-list":
        return "w-72";
      case "grouped-list":
        return "w-[550px]";
      default:
        return "";
    }
  };
  
  const renderDropdownContent = () => {
    switch (dropdown.type) {
      case "cards":
        return <CardsDropdown dropdown={dropdown} />;
      case "columns":
        return <ColumnsDropdown dropdown={dropdown} />;
      case "simple-list":
        return <SimpleListDropdown dropdown={dropdown} />;
      case "grouped-list":
        return <GroupedListDropdown dropdown={dropdown} />;
      default:
        return null;
    }
  };
  
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={href}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover-elevate rounded-md transition-colors"
        data-testid={`nav-dropdown-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </a>
      
      {isOpen && (
        isWideDropdown ? (
          <div 
            className="fixed top-16 left-0 right-0 z-50 flex justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className={`bg-card border border-border rounded-lg shadow-lg ${getDropdownWidth()}`}
            >
              {renderDropdownContent()}
            </div>
          </div>
        ) : (
          <div 
            className={`absolute top-full left-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg ${getDropdownWidth()}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderDropdownContent()}
          </div>
        )
      )}
    </div>
  );
}
