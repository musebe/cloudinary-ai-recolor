// components/ProductDetail.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { Product } from './product-card';
import { SkeletonImage } from './SkeletonImage';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [active, setActive] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const btn = gallery.querySelector<HTMLButtonElement>(
      `[data-index="${active}"]`
    );
    if (!btn) return;

    // Only scroll horizontally—no vertical jump
    const left = btn.offsetLeft;
    const width = btn.offsetWidth;
    const target = left - gallery.clientWidth / 2 + width / 2;
    gallery.scrollTo({ left: target, behavior: 'smooth' });
  }, [active]);

  return (
    <main className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Image gallery */}
        <div>
          <div className='relative w-full h-[60vh] max-h-[500px] bg-white border rounded-2xl overflow-hidden shadow-sm p-4'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={product.variants[active]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='absolute inset-0'
              >
                <SkeletonImage
                  src={product.variants[active]}
                  alt={`${product.name} ${active + 1}`}
                  fill
                  priority
                  sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-contain'
                  wrapperClassName='w-full h-full'
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          <div
            ref={galleryRef}
            className='mt-6 flex gap-4 overflow-x-auto px-6 py-4 scroll-smooth'
          >
            {product.variants.map((src, i) => {
              const color =
                src.split('to-color_')[1]?.split('/')[0] || `Color ${i + 1}`;
              return (
                <figure
                  key={i}
                  data-index={i}
                  aria-current={i === active}
                  className='flex flex-col items-center space-y-2 first:ml-6 last:mr-6'
                >
                  <button
                    onClick={() => setActive(i)}
                    aria-label={`Select ${color}`}
                    className={clsx(
                      'relative w-20 h-20 flex-none rounded-xl border shadow-sm transition',
                      i === active
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    <SkeletonImage
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      width={80}
                      height={80}
                      priority={i === 0}
                      className='object-contain w-full h-full rounded-xl'
                      wrapperClassName='w-full h-full'
                    />
                  </button>
                  <figcaption className='text-xs text-muted-foreground capitalize'>
                    {color}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Product info */}
        <div className='space-y-6'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <div className='flex items-center gap-2 mt-2'>
            <div className='flex text-orange-500'>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-4 h-4',
                    i < Math.round(product.rating ?? 0) ? 'fill-current' : ''
                  )}
                />
              ))}
            </div>
            <span className='text-muted-foreground text-sm'>
              ({(product.rating ?? 0).toFixed(1)})
            </span>
          </div>

          <div className='text-2xl font-semibold'>
            ${product.price.toFixed(2)}{' '}
            <span className='text-base text-muted-foreground line-through ml-2'>
              ${(product.price * 1.25).toFixed(2)}
            </span>
          </div>

          <p className='text-muted-foreground text-sm leading-relaxed'>
            {product.description ??
              'AI‑generated recolor variants above. Hover over thumbnails to switch.'}
          </p>

          <ul className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
            <li>
              <strong className='text-foreground'>Brand:</strong>{' '}
              {product.brand ?? 'Generic'}
            </li>
            <li>
              <strong className='text-foreground'>Category:</strong>{' '}
              {product.category ?? 'Apparel'}
            </li>
            <li>
              <strong className='text-foreground'>Color:</strong> Multi
            </li>
            <li>
              <strong className='text-foreground'>Availability:</strong>{' '}
              {product.inStock ? 'In stock' : 'Out of stock'}
            </li>
          </ul>

          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Button className='flex-1' disabled={!product.inStock}>
              Add to Cart
            </Button>
            <Button
              variant='secondary'
              className='flex-1'
              disabled={!product.inStock}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
