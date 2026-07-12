'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WizardProgress from '@/components/host/WizardProgress';
import DagiLoader from '@/components/DagiLoader';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Amenity { id: number; name: string; icon: string; }

export default function AmenitiesStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: all }, { data: current }] = await Promise.all([
        supabase.from('amenities').select('id, name, icon').order('name'),
        supabase.from('listing_amenities').select('amenity_id').eq('listing_id', id),
      ]);
      setAmenities(all ?? []);
      setSelected(new Set((current ?? []).map((r) => r.amenity_id)));
      setLoading(false);
    }
    load();
  }, [id]);

  const toggle = (amenityId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(amenityId)) next.delete(amenityId);
      else next.add(amenityId);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    // Simplest correct approach: clear existing selections for this listing, re-insert current set
    await supabase.from('listing_amenities').delete().eq('listing_id', id);
    if (selected.size > 0) {
      const rows = Array.from(selected).map((amenity_id) => ({ listing_id: id, amenity_id }));
      const { error } = await supabase.from('listing_amenities').insert(rows);
      if (error) {
        toast({ title: 'Could not save amenities', description: error.message, variant: 'destructive' });
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    router.push(`/host/listings/${id}/pricing`);
  };

  if (loading) return <DagiLoader label="Loading amenities" sublabel="Muna dawo da bayanai..." />;

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <WizardProgress step={4} />

      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">What does your place offer?</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">Select everything that applies.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-stack-lg">
        {amenities.map((a) => {
          const isSelected = selected.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl border p-3 text-left transition-colors',
                isSelected ? 'border-primary-container bg-primary-container/10' : 'border-outline-variant/30 hover:bg-surface-container-low'
              )}
            >
              <span className={cn('w-5 h-5 rounded-full border flex items-center justify-center shrink-0', isSelected ? 'bg-primary-container border-primary-container' : 'border-outline-variant')}>
                {isSelected && <Check className="h-3 w-3 text-on-primary" />}
              </span>
              <span className="font-label-md text-label-md text-on-surface">{a.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => router.push(`/host/listings/${id}/cultural-features`)} className="px-6 py-3 rounded-full border border-tertiary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-1"
        >
          {saving ? 'Saving…' : <>Next <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </main>
  );
}
