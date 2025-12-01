import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@assets/4geeks-devs-logo_1763162063433.png";

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
          className="flex items-center hover-elevate rounded-md px-3 py-2" 
          data-testid="link-home"
        >
          <img src={logo} alt={t('nav.brand')} className="h-8" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/career-programs" 
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2" 
            data-testid="link-career-programs"
          >
            {t('nav.careerPrograms')}
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2" 
            data-testid="link-dashboard"
          >
            {t('nav.dashboard')}
          </Link>
          <Link 
            href="/component-showcase" 
            className="text-sm font-medium text-muted-foreground hover-elevate rounded-md px-3 py-2" 
            data-testid="link-component-showcase"
          >
            Components
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
