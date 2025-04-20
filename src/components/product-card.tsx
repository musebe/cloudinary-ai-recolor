// src/components/ProductCard.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export type Product = {
  id: string;
  name: string;
  price: number;
  thumb?: string;
  variants: string[];
  description?: string;
  rating?: number;
  brand?: string;
  category?: string;
  inStock?: boolean;
};

interface ProductCardProps {
  p: Product;
  /** Mark as LCP image above the fold */
  priority?: boolean;
}

export default function ProductCard({ p, priority = false }: ProductCardProps) {
  const [isFav, setIsFav] = useState(false);
  const imgSrc = useMemo(() => p.thumb ?? p.variants[0], [p.thumb, p.variants]);
  const rating = p.rating ?? 0;

  return (
    <Card className='group relative overflow-hidden border hover:shadow-md transition-shadow'>
      <Link href={`/products/${p.id}`} className='flex flex-col h-full'>
        <div className='relative aspect-[3/4] w-full overflow-hidden rounded-t-xl bg-white'>
          <Image
            src={imgSrc}
            alt={p.name}
            width={300}
            height={400}
            priority={priority}
            className='object-contain w-full h-full'
          />
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFav((prev) => !prev);
          }}
          aria-pressed={isFav}
          className='absolute top-2 right-2 z-10 bg-white/80 backdrop-blur'
        >
          <Heart className={isFav ? 'text-red-500' : 'text-muted-foreground'} />
        </Button>

        <CardHeader className='px-4 pt-4'>
          <CardTitle className='text-sm font-semibold line-clamp-2'>
            {p.name}
          </CardTitle>
          {p.description && (
            <CardDescription className='text-xs text-muted-foreground line-clamp-2'>
              {p.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className='px-4 pt-0'>
          <div className='flex items-center space-x-1 text-xs'>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={clsx(
                  'h-4 w-4',
                  i + 1 <= Math.floor(rating)
                    ? 'text-orange-500'
                    : 'text-muted-foreground'
                )}
                fill={i + 1 <= rating ? 'currentColor' : 'none'}
              />
            ))}
            <span className='text-muted-foreground'>({rating.toFixed(1)})</span>
          </div>
        </CardContent>

        <CardFooter className='px-4 pb-4 pt-2 flex items-center justify-between mt-auto'>
          <span className='font-semibold text-sm'>${p.price.toFixed(2)}</span>
          <Button variant='outline' size='sm'>
            Buy now
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
