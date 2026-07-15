import DagiLoader from '@/components/DagiLoader';

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <DagiLoader label="Loading Arewa Stay" sublabel="Preparing your stay experience..." />
    </main>
  );
}
