import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Navbar, type NavbarConfig } from "@/components/menus";
import logo from "@assets/4geeks-devs-logo_1763162063433.png";

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: menuConfig, isLoading } = useQuery<NavbarConfig>({
    queryKey: ["/api/menus", "main-navbar"],
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('navbar') === 'false') {
    return null;
  }
  
  return (
    <header className={`sticky top-0 z-50 w-full bg-background transition-colors ${isScrolled ? 'border-b' : 'border-b border-background'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link 
          href="/" 
          className="flex items-center hover-elevate rounded-md px-3 py-2" 
          data-testid="link-home"
        >
          <img src={logo} alt={t('nav.brand')} className="h-8" />
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          {isLoading ? (
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : menuConfig ? (
            <Navbar config={menuConfig} />
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" data-testid="button-profile">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <IconUser className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
