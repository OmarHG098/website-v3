import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2" data-testid="link-home">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">The AI Reskilling Platform</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/courses">
            <a className="text-sm font-medium hover-elevate rounded-md px-3 py-2" data-testid="link-courses">
              Courses
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="text-sm font-medium hover-elevate rounded-md px-3 py-2" data-testid="link-dashboard">
              My Dashboard
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" data-testid="button-profile">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
