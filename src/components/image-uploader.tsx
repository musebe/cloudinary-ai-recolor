'use client';

import { useState, useCallback } from 'react';
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
  onUploadSuccess?: (variants: string[]) => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [picked, setPicked] = useState<Color[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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
      toast.success('Upload received!');
      setOpen(false);
      setName('');
      setPrice('');
      setFile(null);
      setPicked([]);
      onUploadSuccess?.(newProduct.variants);
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
        <Button variant='default' className='w-full sm:w-auto'>
          + Add product
        </Button>
      </DialogTrigger>

      <DialogContent
        className='
          w-full max-w-sm 
          sm:max-w-md 
          rounded-lg 
          p-2 sm:p-4 
          max-h-[90vh] overflow-y-auto
        '
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>Upload an image and pick colors.</DialogDescription>

        <Card className='space-y-4 p-0 sm:p-4'>
          <CardHeader>
            <CardTitle>Upload & Recolor</CardTitle>
          </CardHeader>
          <CardInner className='space-y-4'>
            {/* Name */}
            <div className='space-y-1'>
              <Label>Product Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='T‑Shirt'
                className='w-full'
              />
              {!name.trim() && (
                <p className='text-xs text-destructive'>Name is required.</p>
              )}
            </div>

            {/* Price */}
            <div className='space-y-1'>
              <Label>Price ($)</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='29.99'
                className='w-full'
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
                className='h-12 rounded bg-muted w-full'
              />
            ) : (
              <Button className='w-full' disabled={!isValid} onClick={upload}>
                Upload & Generate
              </Button>
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
    (accepted: File[]) => accepted[0] && onChange(accepted[0]),
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
          'w-full h-32 sm:h-40 flex items-center justify-center',
          'border-2 border-dashed rounded cursor-pointer',
          isDragActive ? 'border-primary bg-muted' : 'border-muted'
        )}
      >
        <input {...getInputProps()} />
        {!file ? (
          <p className='text-sm text-muted-foreground text-center px-2'>
            Drag or click to upload an image
          </p>
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt='Preview'
            className='h-full object-contain'
          />
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
    <div className='space-y-2'>
      <Label>Available Colors</Label>
      <div className='flex flex-wrap gap-2 mt-1'>
        {options.map((color) => {
          const isSelected = selected.includes(color);
          const isLight = ['white', 'beige', 'lavender', 'pink'].includes(
            color
          );
          return (
            <button
              key={color}
              type='button'
              onClick={() => onToggle(color)}
              aria-pressed={isSelected}
              className={clsx(
                'flex items-center justify-center rounded border-2',
                isSelected
                  ? 'w-8 h-8 sm:w-9 sm:h-9 border-primary ring-2 ring-primary'
                  : 'w-8 h-8 sm:w-9 sm:h-9 border-muted'
              )}
              style={{ backgroundColor: color }}
            >
              {isSelected && (
                <Check
                  className={clsx(isLight ? 'text-black' : 'text-white')}
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
