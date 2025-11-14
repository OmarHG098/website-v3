import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBook, IconUser } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 w-full bg-background transition-colors ${isScrolled ? 'border-b' : 'border-b border-background'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2" 
          data-testid="link-home"
        >
          <IconBook className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">{t('nav.brand')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/courses" 
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2" 
            data-testid="link-courses"
          >
            {t('nav.courses')}
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2" 
            data-testid="link-dashboard"
          >
            {t('nav.dashboard')}
          </Link>
        </nav>

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
