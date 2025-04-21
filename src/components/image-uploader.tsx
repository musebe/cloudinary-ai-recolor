'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent as CardInner,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

const COLORS = [
  'red',
  'green',
  'blue',
  'black',
  'white',
  'gray',
  'beige',
  'lavender',
  'pink',
] as const;

type Color = (typeof COLORS)[number];

export default function ImageUploader({
  onUploadSuccess,
}: {
  onUploadSuccess?: (urls: string[]) => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [picked, setPicked] = useState<Color[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const isValid =
    !!name.trim() &&
    !isNaN(Number(price)) &&
    file !== null &&
    picked.length > 0;

  const upload = useCallback(async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    const body = new FormData();
    body.append('file', file!);
    body.append('name', name);
    body.append('price', price);
    body.append('colors', JSON.stringify(picked));

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      if (!res.ok) throw new Error(res.statusText);
      const newProduct = await res.json();

      toast.success('Product uploaded!');
      setOpen(false);
      setName('');
      setPrice('');
      setFile(null);

      // build recolor-preview URLs
      const urls = picked.map(
        (c) =>
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_gen_recolor:prompt_tshirt;to-color_${c}/f_auto/q_auto/v1/${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${newProduct.publicId}`
      );
      setPreviewUrls(urls);

      // scroll into view after modal closes
      setTimeout(
        () => previewRef.current?.scrollIntoView({ behavior: 'smooth' }),
        300
      );

      // optional callback for parent
      onUploadSuccess?.(urls);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  }, [file, picked, name, price, isValid, router, onUploadSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>+ Add product</Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-md sm:rounded-lg sm:w-[90vw]'>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>
          Upload an image, choose colors, and generate recolored previews.
        </DialogDescription>

        <Card className='space-y-6 p-4'>
          <CardHeader>
            <CardTitle>Upload & Recolor</CardTitle>
          </CardHeader>
          <CardInner className='space-y-4'>
            {/* Product Name */}
            <div className='space-y-2'>
              <Label>Product Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='T‑Shirt'
              />
              {!name.trim() && (
                <p className='text-xs text-destructive'>Name is required.</p>
              )}
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <Label>Price ($)</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='29.99'
              />
              {price && isNaN(Number(price)) && (
                <p className='text-xs text-destructive'>Must be a number.</p>
              )}
            </div>

            {/* Image Picker */}
            <ImagePicker file={file} onChange={setFile} />

            {/* Color Picker */}
            <ColorPicker
              options={COLORS}
              selected={picked}
              onToggle={(c) =>
                setPicked((prev) =>
                  prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                )
              }
            />

            {error && <p className='text-destructive text-sm'>{error}</p>}

            {/* Upload Button */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  repeatType: 'reverse',
                }}
                className='h-12 rounded bg-muted'
              />
            ) : (
              <Button className='w-full' disabled={!isValid} onClick={upload}>
                Upload & Generate
              </Button>
            )}

            {/* Collapsible Previews (only after upload & colors selected) */}
            {previewUrls.length > 0 && picked.length > 0 && (
              <div ref={previewRef}>
                <Collapsible>
                  <CollapsibleTrigger className='w-full flex items-center justify-between rounded bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80'>
                    Show Generated Previews ({previewUrls.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className='mt-2 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto'>
                    {previewUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className='w-full aspect-square rounded border object-contain'
                      />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardInner>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function ImagePicker({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onChange(accepted[0]);
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div className='space-y-2'>
      <Label>Product Image</Label>
      <div
        {...getRootProps()}
        className={clsx(
          'w-full h-40 flex items-center justify-center border-2 border-dashed rounded cursor-pointer',
          isDragActive ? 'border-primary bg-muted' : 'border-muted'
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt='Preview'
            className='h-full object-contain'
          />
        ) : (
          <p className='text-sm text-muted-foreground'>
            Drag or click to upload an image
          </p>
        )}
      </div>
    </div>
  );
}

function ColorPicker({
  options,
  selected,
  onToggle,
}: {
  options: readonly Color[];
  selected: Color[];
  onToggle: (color: Color) => void;
}) {
  return (
    <div>
      <Label>Available Colors</Label>
      <div className='flex flex-wrap gap-2 mt-2'>
        {options.map((color) => {
          const isSelected = selected.includes(color);
          const isLight = [
            'white',
            'lightgray',
            'beige',
            'lavender',
            'pink',
          ].includes(color);
          return (
            <button
              key={color}
              type='button'
              onClick={() => onToggle(color)}
              aria-pressed={isSelected}
              className={clsx(
                'w-9 h-9 rounded border-2 relative flex items-center justify-center transition',
                isSelected
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-muted'
              )}
              style={{ backgroundColor: color }}
            >
              {isSelected && (
                <Check
                  className={clsx(
                    'w-4 h-4',
                    isLight ? 'text-black' : 'text-white'
                  )}
                />
              )}
              <span className='sr-only'>{color}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
