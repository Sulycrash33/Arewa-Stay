'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allRegions } from '@/lib/constants';
import { Handshake, Plus } from 'lucide-react';

interface Liaison { id: string; full_name: string; phone: string; state: string; cities: string[]; active: boolean; }

export default function AdminLiaisonsPage() {
  const { toast } = useToast();
  const [liaisons, setLiaisons] = useState<Liaison[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [cities, setCities] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLiaisons = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('liaisons').select('*').order('state');
    setLiaisons(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadLiaisons(); }, []);

  const handleAdd = async () => {
    if (!fullName || !phone || !state) {
      toast({ title: 'Fill in name, phone, and state', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('liaisons').insert({
      full_name: fullName,
      phone,
      state,
      cities: cities.split(',').map((c) => c.trim()).filter(Boolean),
    });
    setSaving(false);

    if (error) {
      toast({ title: 'Could not add liaison', description: error.message, variant: 'destructive' });
      return;
    }
    setFullName(''); setPhone(''); setState(''); setCities('');
    toast({ title: 'Liaison added' });
    loadLiaisons();
  };

  const toggleActive = async (liaison: Liaison) => {
    const supabase = createClient();
    await supabase.from('liaisons').update({ active: !liaison.active }).eq('id', liaison.id);
    loadLiaisons();
  };

  if (loading) return null;

  return (
    <main className="p-container-margin max-w-3xl">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2 flex items-center gap-2">
        <Handshake className="h-6 w-6 text-primary-container" /> Community Liaisons
      </h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Real local reps who can be assigned to review a host verification or help mediate a dispute.
      </p>

      <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md mb-stack-lg">
        <h2 className="font-title-md text-title-md text-on-surface mb-stack-sm">Add a liaison</h2>
        <div className="grid sm:grid-cols-2 gap-stack-sm mb-stack-sm">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" />
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="border-0 border-b-2 border-clay-brown rounded-none px-0 focus:ring-0 shadow-none">
              <SelectValue placeholder="State / region" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {allRegions.map((r) => <SelectItem key={r.state} value={r.state}>{r.state}</SelectItem>)}
            </SelectContent>
          </Select>
          <input value={cities} onChange={(e) => setCities(e.target.value)} placeholder="Cities covered (comma-separated)" className="bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" />
        </div>
        <button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 bg-primary-container text-on-primary text-sm font-label-md px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-60">
          <Plus className="h-4 w-4" /> {saving ? 'Adding…' : 'Add liaison'}
        </button>
      </div>

      <div className="space-y-2">
        {liaisons.map((l) => (
          <div key={l.id} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-sm flex items-center justify-between">
            <div>
              <h3 className="font-title-md text-sm text-on-surface">{l.full_name}</h3>
              <p className="text-xs text-on-surface-variant">{l.phone} &middot; {l.state}{l.cities.length > 0 && ` (${l.cities.join(', ')})`}</p>
            </div>
            <button
              onClick={() => toggleActive(l)}
              className={`text-xs px-3 py-1 rounded-full ${l.active ? 'bg-primary-container/10 text-primary-container' : 'bg-surface-container text-on-surface-variant'}`}
            >
              {l.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
        {liaisons.length === 0 && <p className="text-center text-on-surface-variant py-stack-md">No liaisons added yet.</p>}
      </div>
    </main>
  );
}
