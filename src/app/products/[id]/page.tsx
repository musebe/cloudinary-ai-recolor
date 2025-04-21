// app/products/[id]/page.tsx
import { Product } from '@/components/product-card';
import ProductDetail from '@/components/product-detail';
import { readProducts } from '@/lib/fileDb';

import { notFound } from 'next/navigation';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // <-- params is a Promise
}) {
  const { id } = await params; // <-- await before using .id
  const products = await readProducts();
  const product = products.find((p: Product) => p.id === id);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
