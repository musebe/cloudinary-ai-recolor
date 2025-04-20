'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu, Search, User, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import ImageUploader from './image-uploader';

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

export default function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 bg-background/80 backdrop-blur border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-extrabold'>
          <span className='text-primary'>Q</span>uickCart
        </Link>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center space-x-6'>
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Top-right icons including Add Product */}
        <div className='flex items-center space-x-2 sm:space-x-4'>
          <Button variant='ghost' size='icon' aria-label='Search'>
            <Search className='h-5 w-5' />
          </Button>

          <Link
            href='/account'
            className='flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors'
          >
            <User className='h-5 w-5' />
            <span className='hidden sm:inline'>Account</span>
          </Link>

          {/* Add Product Button always visible */}
          <ImageUploader />

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' aria-label='Open menu'>
                  <Menu className='h-6 w-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-64 p-6'>
                <SheetHeader>
                  <SheetTitle>
                    <Link href='/' className='text-lg font-bold'>
                      <span className='text-primary'>Q</span>uickCart
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className='mt-6 flex flex-col gap-4'>
                  {LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        'text-base font-medium',
                        pathname === link.href
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
