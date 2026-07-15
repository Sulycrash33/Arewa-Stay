'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WizardProgress from '@/components/host/WizardProgress';
import { ArrowRight, ArrowLeft, Loader2, Upload, X } from 'lucide-react';

interface UploadedImage { id: string; url: string; }

export default function PhotosStep() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadImages = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from('listing_images').select('id, url').eq('listing_id', id).order('sort_order');
    setImages(data ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth?tab=login'); return; }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${id}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('listing-photos').upload(path, file);
      if (uploadError) {
        toast({ title: `Failed to upload ${file.name}`, description: uploadError.message, variant: 'destructive' });
        continue;
      }
      const { data: urlData } = supabase.storage.from('listing-photos').getPublicUrl(path);
      await supabase.from('listing_images').insert({
        listing_id: id,
        url: urlData.publicUrl,
        sort_order: images.length + i,
      });
    }

    await loadImages();
    setUploading(false);
  };

  const removeImage = async (imageId: string) => {
    const supabase = createClient();
    await supabase.from('listing_images').delete().eq('id', imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleNext = () => {
    if (images.length === 0) {
      toast({ title: 'Add at least one photo', description: 'Guests need to see the space before booking.', variant: 'destructive' });
      return;
    }
    router.push(`/host/listings/${id}/cultural-features`);
  };

  if (loading) return null;

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <WizardProgress step={2} />

      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Add photos</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Real photos build trust fast. Show the exterior, living room, bedroom, bathroom, kitchen, and any outdoor or welcome area guests will enjoy.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-stack-md">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-tubali overflow-hidden group">
            <Image src={img.url} alt="Listing photo" fill className="object-cover" />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-inverse-surface/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-inverse-on-surface" />
            </button>
          </div>
        ))}

        <label className="aspect-square rounded-tubali border-2 border-dashed border-clay-brown/40 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-primary-container animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-primary-container mb-1" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">Add photo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="flex justify-between items-center mt-stack-lg">
        <button onClick={() => router.push('/host/listings')} className="px-6 py-3 rounded-full border border-tertiary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Save &amp; exit
        </button>
        <button onClick={handleNext} className="px-8 py-3 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-1">
          Next <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
