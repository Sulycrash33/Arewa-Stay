import Link from 'next/link';
import { getListingsForAdmin } from '@/lib/data';
import ListingModerationCard from '@/components/admin/ListingModerationCard';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'pending', label: 'Pending review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
] as const;

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status === 'approved' || status === 'rejected' ? status : 'pending') as
    | 'pending'
    | 'approved'
    | 'rejected';

  const listings = await getListingsForAdmin(activeStatus);

  return (
    <main>
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-1">Listing moderation</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Review and approve host-submitted listings before they go live to guests.
      </p>

      <div className="flex gap-2 mb-stack-lg border-b border-outline-variant/20">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/listings?status=${tab.key}`}
            className={cn(
              'px-4 py-2 font-label-md text-label-md border-b-2 -mb-px transition-colors',
              activeStatus === tab.key
                ? 'border-primary-container text-m3-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-stack-lg rounded-tubali border border-outline-variant/30 bg-surface-container-low">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            No {activeStatus} listings right now.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-stack-sm">
          {listings.map((listing) => (
            <ListingModerationCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
