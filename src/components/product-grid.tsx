// src/components/ProductGrid.tsx
'use client';

import { useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import ProductCard, { Product } from './product-card';

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Reverse so newest (last in list) appear first
  const sortedProducts = useMemo(() => [...products].reverse(), [products]);

  return (
    <motion.ul
      variants={containerVariants}
      initial='hidden'
      animate='show'
      role='list'
      className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6'
    >
      {sortedProducts.map((product, idx) => (
        <motion.li key={product.id} variants={itemVariants} role='listitem'>
          {/* Only preload the first 5 cards as LCP */}
          <ProductCard p={product} priority={idx < 5} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
