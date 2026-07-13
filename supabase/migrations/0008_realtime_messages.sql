-- Enables Supabase Realtime (Postgres logical replication via
-- supabase_realtime publication) on the messages table. Without this, the
-- client-side `.channel().on('postgres_changes', ...)` subscription used by
-- the conversation thread UI subscribes successfully but never receives any
-- events — a silent failure, not an error.
alter publication supabase_realtime add table messages;
