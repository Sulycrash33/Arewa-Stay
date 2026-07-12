'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WizardProgress from '@/components/host/WizardProgress';
import { allRegions } from '@/lib/constants';
import { ArrowRight, Loader2 } from 'lucide-react';

const PROPERTY_TYPES = [
  'Family Compound', 'Apartment', 'Self-Contain', 'Duplex', 'Bungalow',
  'Wedding Suite', 'Guest Wing / Boys Quarters', 'Villa', 'Lodge',
];

export default function NewListingPage() {
  const router = useRouter();
  const { profile, isLoggedIn, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [maxGuests, setMaxGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const citiesForState = allRegions.find((r) => r.state === state)?.cities ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }
    if (!title || !description || !type || !state || !city || !address) {
      toast({ title: 'Please fill in every field', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .insert({
        host_id: profile.id,
        title,
        description,
        type,
        state,
        city,
        address,
        max_guests: maxGuests,
        price_per_night: 0, // set in the pricing step
        currency: 'NGN',
        status: 'pending',
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not create listing', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Listing started — let\'s add some photos' });
    router.push(`/host/listings/${data.id}/photos`);
  };

  if (userLoading) return null;

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <WizardProgress step={1} />

      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Tell us about your place</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Start with the basics — you can add photos, cultural features, and pricing in the next steps.
      </p>

      <form onSubmit={handleSubmit} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md space-y-stack-md">
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Listing title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Family Compound with Zaure, near Kano GRA"
            className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
          />
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Property type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="border-0 border-b-2 border-clay-brown rounded-none px-0 focus:ring-0 shadow-none">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 gap-stack-sm">
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">State</label>
            <Select value={state} onValueChange={(v) => { setState(v); setCity(''); }}>
              <SelectTrigger className="border-0 border-b-2 border-clay-brown rounded-none px-0 focus:ring-0 shadow-none">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {allRegions.map((r) => <SelectItem key={r.state} value={r.state}>{r.state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">City / Town</label>
            <Select value={city} onValueChange={setCity} disabled={!state}>
              <SelectTrigger className="border-0 border-b-2 border-clay-brown rounded-none px-0 focus:ring-0 shadow-none">
                <SelectValue placeholder={state ? 'Select a town' : 'Pick a state first'} />
              </SelectTrigger>
              <SelectContent>
                {citiesForState.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Address</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address (only shared with confirmed guests)"
            className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
          />
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Max guests</label>
          <input
            type="number"
            min={1}
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
            className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
          />
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your space, the neighborhood, and what makes it special..."
            className="w-full bg-transparent border-2 border-clay-brown/30 rounded-lg focus:ring-0 focus:border-primary-container px-3 py-2 font-body-md min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue to Photos <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </main>
  );
}
