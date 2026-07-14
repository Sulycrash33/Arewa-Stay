'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function VoiceMessageBubble({ audioPath, durationSec }: { audioPath: string; durationSec: number | null }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUrl() {
      const supabase = createClient();
      const { data } = await supabase.storage.from('voice-notes').createSignedUrl(audioPath, 3600);
      if (!cancelled && data) setSignedUrl(data.signedUrl);
    }
    loadUrl();
    return () => { cancelled = true; };
  }, [audioPath]);

  if (!signedUrl) {
    return (
      <div className="flex items-center gap-2 py-1">
        <Loader2 className="h-4 w-4 animate-spin text-on-surface-variant" />
        <span className="text-xs text-on-surface-variant">Loading voice note…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <audio controls src={signedUrl} className="h-8 max-w-[220px]" />
      {durationSec != null && <span className="text-[11px] opacity-70">{durationSec}s</span>}
    </div>
  );
}
