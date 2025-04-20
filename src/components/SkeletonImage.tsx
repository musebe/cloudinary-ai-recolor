// components/SkeletonImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface SkeletonImageProps
  extends Omit<ImageProps, 'onLoadingComplete'> {
  /** classes for the outer wrapper—must set width & height for fill */
  wrapperClassName?: string;
  /** classes forwarded to the <img> (or internal span for object-fit, etc.) */
  className?: string;
}

export function SkeletonImage({
  wrapperClassName,
  className,
  onLoad,
  ...imgProps
}: SkeletonImageProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setLoaded(true);
    onLoad?.(e);
  }

  return (
    <div className={clsx('relative', wrapperClassName)}>
      {/* only show the gray pulse _after_ hydration and _before_ the image loads */}
      {mounted && !loaded && (
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-gray-200 animate-pulse'
        />
      )}

      {/* the real Next/Image fill or fixed image */}
      <Image
        {...imgProps}
        className={clsx(className, loaded ? 'block' : 'invisible')}
        onLoad={handleLoad}
      />
    </div>
  );
}
