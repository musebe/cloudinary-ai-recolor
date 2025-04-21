'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import ImageUploader from './image-uploader';

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About cloudinary-ai-recolor', href: '/about' },
] as const;

export default function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 bg-background/80 backdrop-blur border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-extrabold'>
          <span className='text-primary'>Q</span>uickCart
        </Link>

        {/* Desktop nav */}
        <motion.nav
          className='hidden md:flex items-center space-x-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.nav>

        {/* Actions: Add Product + Mobile Menu */}
        <div className='flex items-center space-x-2 sm:space-x-4'>
          <ImageUploader />

          <div className='md:hidden'>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                  <SheetDescription>Site navigation menu</SheetDescription>
                </SheetHeader>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.nav
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='mt-6 flex flex-col gap-4'
                    >
                      {LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={clsx(
                            'text-base font-medium transition-colors',
                            pathname === link.href
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-primary'
                          )}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
