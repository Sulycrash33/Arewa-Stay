import DagiLoader from '@/components/DagiLoader';

export default function ListingsLoading() {
  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <DagiLoader label="Loading stays" sublabel="Finding available homes across the North..." />
    </main>
  );
}
