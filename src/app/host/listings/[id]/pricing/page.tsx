'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WizardProgress from '@/components/host/WizardProgress';
import DagiLoader from '@/components/DagiLoader';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PricingStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'NGN' | 'XOF'>('NGN');
  const [womenOnly, setWomenOnly] = useState(false);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [noAlcohol, setNoAlcohol] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('price_per_night, currency, women_only, family_only, no_alcohol')
        .eq('id', id)
        .single();
      if (data) {
        setPrice(data.price_per_night > 0 ? String(data.price_per_night) : '');
        setCurrency(data.currency);
        setWomenOnly(data.women_only);
        setFamilyOnly(data.family_only);
        setNoAlcohol(data.no_alcohol);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSave = async () => {
    const numericPrice = Number(price);
    if (!numericPrice || numericPrice <= 0) {
      toast({ title: 'Enter a valid nightly price', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({
        price_per_night: numericPrice,
        currency,
        women_only: womenOnly,
        family_only: familyOnly,
        no_alcohol: noAlcohol,
      })
      .eq('id', id);
    setSaving(false);

    if (error) {
      toast({ title: 'Could not save pricing', description: error.message, variant: 'destructive' });
      return;
    }
    router.push(`/host/listings/${id}/review`);
  };

  if (loading) return <DagiLoader label="Loading pricing" sublabel="Muna dawo da bayanai..." />;

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <WizardProgress step={5} />

      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Set your price</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">You can change this anytime after your listing goes live.</p>

      <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md space-y-stack-md mb-stack-lg">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Price per night</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="45000"
              className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-lg text-body-lg text-on-surface"
            />
          </div>
          <div className="w-28">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Currency</label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as 'NGN' | 'XOF')}>
              <SelectTrigger className="border-0 border-b-2 border-clay-brown rounded-none px-0 focus:ring-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">₦ NGN</SelectItem>
                <SelectItem value="XOF">CFA XOF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-stack-md space-y-stack-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-title-md text-sm text-on-surface">Women-only</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Restrict bookings to women-only groups</p>
            </div>
            <Switch checked={womenOnly} onCheckedChange={setWomenOnly} className="data-[state=checked]:bg-primary-container" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-title-md text-sm text-on-surface">Family-only</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Restrict bookings to families</p>
            </div>
            <Switch checked={familyOnly} onCheckedChange={setFamilyOnly} className="data-[state=checked]:bg-primary-container" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-title-md text-sm text-on-surface">No alcohol</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Alcohol-free property</p>
            </div>
            <Switch checked={noAlcohol} onCheckedChange={setNoAlcohol} className="data-[state=checked]:bg-primary-container" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => router.push(`/host/listings/${id}/amenities`)} className="px-6 py-3 rounded-full border border-tertiary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-1"
        >
          {saving ? 'Saving…' : <>Review listing <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </main>
  );
}
