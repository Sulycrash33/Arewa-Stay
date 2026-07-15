'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import DagiLoader from '@/components/DagiLoader';
import WizardProgress from '@/components/host/WizardProgress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FEATURES = [
  { key: 'has_zaure' as const, title: 'Private welcome area', desc: 'A separate space to greet guests warmly, without stepping into the rest of the home.' },
  { key: 'detached_quarters' as const, title: 'A place of their own', desc: 'Guests get a fully separate, private space to stay in.' },
  { key: 'has_247_solar' as const, title: 'Always-on power', desc: 'Guests can count on the lights staying on, day or night.' },
  { key: 'has_borehole' as const, title: 'Reliable water supply', desc: 'A steady, independent source of clean water for guests.' },
];

type FeatureKey = typeof FEATURES[number]['key'];

export default function CulturalFeaturesStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<FeatureKey, boolean>>({
    has_zaure: false,
    detached_quarters: false,
    has_247_solar: false,
    has_borehole: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('has_zaure, detached_quarters, has_247_solar, has_borehole')
        .eq('id', id)
        .single();
      if (data) setValues(data as any);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('listings').update(values).eq('id', id);
      if (error) throw error;
      toast({ title: 'Saved' });
      router.push(`/host/listings/${id}/amenities`);
    } catch (err) {
      toast({ title: 'Save failed', description: String(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DagiLoader label="Loading your property" sublabel="Muna dawo da bayanan gidanku..." />;
  }

  return (
    <main className="flex-grow px-container-margin py-stack-lg max-w-3xl mx-auto w-full flex flex-col">
      <WizardProgress step={3} />

      <div className="mb-stack-lg">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-m3-primary mb-stack-sm">What makes your place comfortable?</h2>
        <p className="text-on-surface-variant">
          Little touches of comfort and reliability go a long way. Let guests know what to expect before they arrive.
        </p>
      </div>

      <div className="rounded-tubali tubali-border bg-surface-container-lowest p-stack-md md:p-stack-lg shadow-sm space-y-stack-md">
        {FEATURES.map(({ key, title, desc }) => (
          <div key={key} className="flex items-center justify-between p-stack-md rounded-xl border border-surface-dim hover:bg-surface-container-low transition-colors">
            <div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1">{title}</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">{desc}</p>
            </div>
            <Switch
              checked={values[key]}
              onCheckedChange={(checked) => setValues((v) => ({ ...v, [key]: checked }))}
              className="ml-4 data-[state=checked]:bg-primary-container"
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 w-full bg-surface border-t border-surface-dim p-stack-md flex justify-between items-center mt-auto -mx-container-margin px-container-margin">
        <button onClick={() => router.push(`/host/listings/${id}/photos`)} className="px-6 py-3 rounded-full border border-tertiary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1">
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
