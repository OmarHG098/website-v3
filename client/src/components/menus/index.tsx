export { SimpleLink, type SimpleLinkProps } from "./SimpleLink";
export { Dropdown, type DropdownProps } from "./Dropdown";
export { EditableDropdownPreview } from "./EditableDropdownPreview";

import { SimpleLink, type SimpleLinkProps } from "./SimpleLink";
import { Dropdown, type DropdownProps } from "./Dropdown";

export type NavbarItem = {
  label: string;
  href: string;
  component: "SimpleLink" | "Dropdown";
  dropdown?: DropdownProps["dropdown"];
};

export type NavbarConfig = {
  navbar: {
    items: NavbarItem[];
  };
};

const componentMap: Record<string, React.ComponentType<any>> = {
  SimpleLink,
  Dropdown,
};

export function resolveComponent(componentName: string): React.ComponentType<any> | null {
  return componentMap[componentName] || null;
}

export function renderNavbarItem(item: NavbarItem) {
  const Component = resolveComponent(item.component);
  
  if (!Component) {
    console.warn(`Unknown menu component: ${item.component}`);
    return null;
  }
  
  if (item.component === "Dropdown" && item.dropdown) {
    return <Component key={item.label} label={item.label} href={item.href} dropdown={item.dropdown} />;
  }
  
  return <Component key={item.label} label={item.label} href={item.href} />;
}

export function Navbar({ config }: { config: NavbarConfig }) {
  if (!config?.navbar?.items) {
    return null;
  }
  
  return (
    <nav className="flex flex-wrap items-center gap-1" data-testid="navbar">
      {config.navbar.items.map((item) => renderNavbarItem(item))}
    </nav>
  );
}
