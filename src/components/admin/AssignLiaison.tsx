'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Liaison { id: string; full_name: string; phone: string; }

export default function AssignLiaison({
  verificationId,
  liaisons,
  currentLiaisonId,
}: {
  verificationId: string;
  liaisons: Liaison[];
  currentLiaisonId: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async (liaisonId: string) => {
    const liaison = liaisons.find((l) => l.id === liaisonId);
    if (!liaison) return;
    setAssigning(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('host_verifications')
      .update({ liaison_id: liaison.id, liaison_name: liaison.full_name, liaison_contact: liaison.phone })
      .eq('id', verificationId);
    setAssigning(false);

    if (error) {
      toast({ title: 'Could not assign liaison', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `Assigned to ${liaison.full_name}` });
    router.refresh();
  };

  return (
    <Select value={currentLiaisonId ?? undefined} onValueChange={handleAssign} disabled={assigning}>
      <SelectTrigger className="text-xs h-8">
        <SelectValue placeholder="Assign a liaison" />
      </SelectTrigger>
      <SelectContent>
        {liaisons.map((l) => (
          <SelectItem key={l.id} value={l.id}>{l.full_name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
