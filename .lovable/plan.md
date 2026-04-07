

# Plan: Move Whitelist to Supabase

## What changes
Replace localStorage with two Supabase tables (`videos` and `channels`) so the whitelist syncs across devices. Since there's only one user, no auth or RLS complexity is needed — tables will be publicly readable/writable (private URL deployment provides the access boundary).

## Database tables

**`videos`** table:
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK, default gen_random_uuid()) | |
| youtube_video_id | text, not null | |
| title | text, not null | |
| thumbnail_url | text | |
| channel_id | text | |
| channel_title | text | |
| description | text | |
| broken | boolean, default false | |
| added_at | timestamptz, default now() | |

**`channels`** table:
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK, default gen_random_uuid()) | |
| youtube_channel_id | text, not null | |
| title | text, not null | |
| avatar_url | text, default '' | |
| added_at | timestamptz, default now() | |

RLS enabled but with permissive policies (select/insert/delete for anon) since there's a single household and no auth.

## Code changes

1. **Connect Supabase** via Lovable Cloud — generates `src/integrations/supabase/` client and types automatically.

2. **Rewrite `src/hooks/use-app-data.ts`** — replace localStorage read/write with Supabase queries:
   - Load data on mount via `supabase.from('videos').select()` and `supabase.from('channels').select()`
   - `addVideo` → `supabase.from('videos').insert()`
   - `removeVideo` → `supabase.from('videos').delete().eq('id', ...)`
   - `addChannel` / `removeChannel` → same pattern
   - Keep the same return interface so no other components need changes

3. **Add a loading state** to the hook so the UI can show a brief loader while fetching from Supabase on first load.

4. **Remove localStorage** calls entirely — Supabase is the single source of truth.

## What stays the same
- All components (`Index`, `ParentSettings`, `VideoCard`, `ChannelTile`, `Watch`, `ChannelPage`) remain unchanged — they consume the same `useAppData()` hook interface.
- No authentication needed — single household, no user accounts.

