import DagiLoader from '@/components/DagiLoader';

export default function DashboardLoading() {
  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <DagiLoader label="Loading dashboard" sublabel="Gathering your bookings and messages..." />
    </main>
  );
}
