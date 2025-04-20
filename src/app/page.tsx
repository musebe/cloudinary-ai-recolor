// app/page.tsx

import { readProducts } from '@/lib/fileDb';
import ProductGrid from '@/components/product-grid';

export default async function Home() {
  const products = await readProducts();

  return (
    <main className='max-w-7xl mx-auto px-6 py-10 space-y-12'>
      <section>
        <h2 className='text-2xl font-bold mb-4'>Popular products</h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
