import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className='border-t bg-background text-muted-foreground text-sm mt-auto'>
      <div className='container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left'>
        <p>© 2025 QuickCart. All rights reserved.</p>
        <p>
          Built by{' '}
          <Link
            href='https://github.com/musebe/cloudinary-ai-recolor'
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-primary'
          >
            Eugine Musebe
          </Link>{' '}
          using Next.js
        </p>
      </div>
    </footer>
  );
}
