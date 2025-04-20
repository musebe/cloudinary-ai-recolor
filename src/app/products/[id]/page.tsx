// src/app/products/[id]/page.tsx
import { readProducts } from '@/lib/fileDb';
import ProductDetail from '@/components/product-detail';
import { notFound } from 'next/navigation';
import type { Product } from '@/components/product-card';
import { Suspense } from 'react';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;
  const products = await readProducts();
  const product = products.find((p: Product) => p.id === productId);

  if (!product) notFound();

  return (
    <Suspense
      fallback={
        // simple page‑level skeleton
        <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 animate-pulse'>
          <div className='h-[60vh] max-h-[500px] bg-gray-200 rounded-2xl mb-8' />
          <div className='flex space-x-4 overflow-hidden'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='w-20 h-20 bg-gray-200 rounded-xl' />
            ))}
          </div>
        </div>
      }
    >
      <ProductDetail product={product} />
    </Suspense>
  );
}
