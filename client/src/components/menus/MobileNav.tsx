import { useState } from "react";
import { Link } from "wouter";
import { IconMenu2, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { NavbarConfig, NavbarItem } from "./index";

interface MobileNavProps {
  config: NavbarConfig;
}

interface MobileNavItemProps {
  item: NavbarItem;
  onNavigate: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

function MobileNavItem({ item, onNavigate, isOpen, onToggle }: MobileNavItemProps) {
  if (item.component === "Dropdown" && item.dropdown) {
    const dropdown = item.dropdown;

    return (
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-2 text-base font-medium text-foreground hover-elevate rounded-md">
          <span>{item.label}</span>
          <IconChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pb-2">
          {dropdown.type === "cards" && dropdown.items && (
            <div className="space-y-1">
              {dropdown.items.map((card, index) => (
                <a
                  key={index}
                  href={card.href}
                  onClick={onNavigate}
                  className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover-elevate rounded-md"
                  data-testid={`mobile-nav-card-${(card.title || "item").toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <IconChevronRight className="h-3 w-3" />
                  <div>
                    <div className="font-medium text-foreground">{card.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{card.description}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          {dropdown.type === "columns" && dropdown.columns && (
            <div className="space-y-4">
              {dropdown.columns.map((column, colIndex) => (
                <div key={colIndex}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    {column.title}
                  </div>
                  <div className="space-y-1">
                    {column.items.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        onClick={onNavigate}
                        className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover-elevate rounded-md"
                        data-testid={`mobile-nav-column-item-${(link.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <IconChevronRight className="h-3 w-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {dropdown.type === "simple-list" && dropdown.items && (
            <div className="space-y-1">
              {dropdown.items.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={onNavigate}
                  className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover-elevate rounded-md"
                  data-testid={`mobile-nav-list-item-${(link.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <IconChevronRight className="h-3 w-3" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
          
          {dropdown.type === "grouped-list" && dropdown.groups && (
            <div className="space-y-4">
              {dropdown.groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        onClick={onNavigate}
                        className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover-elevate rounded-md"
                        data-testid={`mobile-nav-group-item-${(link.label || "item").toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <IconChevronRight className="h-3 w-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center py-3 px-2 text-base font-medium text-foreground hover-elevate rounded-md"
      data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {item.label}
    </Link>
  );
}

export function MobileNav({ config }: MobileNavProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  const handleNavigate = () => {
    setIsSheetOpen(false);
    setOpenItemIndex(null);
  };

  const handleToggle = (index: number) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  if (!config?.navbar?.items) {
    return null;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          data-testid="button-mobile-menu"
        >
          <IconMenu2 className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <nav className="flex flex-col mt-8" data-testid="mobile-nav">
          {config.navbar.items.map((item, index) => (
            <MobileNavItem 
              key={index} 
              item={item} 
              onNavigate={handleNavigate}
              isOpen={openItemIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
