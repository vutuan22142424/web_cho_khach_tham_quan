'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary-foreground text-lg">🤖</span>
          </div>
          <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            EXHIBITION ROBOT 2026
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#events" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Sự Kiện
          </Link>
          <Link href="#info" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Liên Hệ
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Desktop Admin Button */}
        <div className="hidden sm:flex items-center">
          <Link href="/login">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 text-xs sm:text-sm"
            >
              Đăng Nhập Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Admin Button */}
        <div className="sm:hidden flex items-center">
          <Link href="/login">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 text-xs px-3"
            >
              QT
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto flex flex-col space-y-3 px-4 py-4">
            <Link href="#events" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2">
              Sự Kiện
            </Link>
            <Link href="#info" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2">
              Liên Hệ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
