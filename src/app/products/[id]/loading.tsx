// app/products/[id]/loading.tsx
export default function Loading() {
  return (
    <div className='max-w-7xl mx-auto px-6 py-12 animate-pulse'>
      <div className='h-[60vh] max-h-[500px] bg-gray-200 rounded-2xl mb-8' />
      <div className='flex space-x-4 overflow-hidden'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='w-20 h-20 bg-gray-200 rounded-xl' />
        ))}
      </div>
    </div>
  );
}
