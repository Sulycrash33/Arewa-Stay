'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert(form);
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not send message', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Message sent', description: "We'll get back to you soon." });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-lg shadow-tubali">
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-m3-primary">Contact Us</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="grid sm:grid-cols-2 gap-stack-sm">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Full Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" placeholder="Your Name" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email Address</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border-2 border-clay-brown/30 rounded-lg focus:ring-0 focus:border-primary-container px-3 py-2 font-body-md min-h-[120px]" placeholder="Your message..." />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors disabled:opacity-60">
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  );
}
