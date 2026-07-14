-- Voice-note messaging support.
alter table messages
  add column audio_url text,
  add column duration_sec int;

-- Private bucket — voice notes are only readable/writable by the two
-- participants of the conversation they belong to, via signed URLs
-- (not a public bucket like listing-photos).
insert into storage.buckets (id, name, public)
values ('voice-notes', 'voice-notes', false);

-- Path convention: {conversation_id}/{message_id}.webm
create policy "conversation participants read voice notes"
on storage.objects for select
using (
  bucket_id = 'voice-notes'
  and exists (
    select 1 from conversations c
    where c.id::text = (storage.foldername(name))[1]
    and (c.guest_id = auth.uid() or c.host_id = auth.uid())
  )
);

create policy "conversation participants upload voice notes"
on storage.objects for insert
with check (
  bucket_id = 'voice-notes'
  and exists (
    select 1 from conversations c
    where c.id::text = (storage.foldername(name))[1]
    and (c.guest_id = auth.uid() or c.host_id = auth.uid())
  )
);
