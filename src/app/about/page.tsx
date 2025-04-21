// src/app/about/page.tsx
'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    title: 'Generative Re‑Color',
    description:
      'Instantly produce unlimited color variants using Cloudinary’s AI-powered e_gen_recolor transformation.',
  },
  {
    title: 'Reusable Watermark',
    description:
      'Overlay a consistent brand watermark during upload, ensuring every variant is properly marked—no extra coding needed.',
  },
  {
    title: 'Eager Transform Caching',
    description:
      'Variants are pre-generated at upload time (synchronous eager transforms), so customers never hit on‑the‑fly timeouts.',
  },
  {
    title: 'Auto Format & Quality',
    description:
      'All images served with Cloudinary’s f_auto and q_auto optimizations so they load fast and look great.',
  },
];

export default function AboutPage() {
  return (
    <main className='container mx-auto px-6 py-16 space-y-16'>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center space-y-4'
      >
        <h1 className='text-4xl font-extrabold'>
          About Cloudinary AI Re‑Color Demo Store
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
          A headless demo shop that showcases how Cloudinary’s AI
          transformations can supercharge your storefront with instant color
          variants, watermarking, and optimized delivery—all without a
          traditional database.
        </p>
        <div className='mx-auto w-full max-w-xl overflow-hidden rounded-2xl shadow-lg'>
          <Image
            src='/preview.png'
            alt='Cloudinary AI Recolor Preview'
            width={1200}
            height={600}
            priority
            className='object-cover'
          />
        </div>
      </motion.section>

      {/* Features */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className='h-full hover:shadow-xl transition-shadow'>
              <CardHeader>
                <CardTitle>{feat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feat.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='space-y-4'
      >
        <h2 className='text-2xl font-bold'>Built With</h2>
        <div className='flex flex-wrap gap-4'>
          <Badge variant='outline'>Next.js 15</Badge>
          <Badge variant='outline'>React 19</Badge>
          <Badge variant='outline'>Tailwind CSS 4</Badge>
          <Badge variant='outline'>shadcn/ui</Badge>
          <Badge variant='outline'>Motion.dev</Badge>
          <Badge variant='outline'>Cloudinary AI</Badge>
        </div>
      </motion.section>
    </main>
  );
}
