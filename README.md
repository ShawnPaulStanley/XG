# XG

XG is a football team manager for building balanced squads and recording match
data. The app runs as a Vite/React single-page application and can use
Supabase for shared persistence.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `npm install` and `npm run dev`.

Without Supabase variables, XG uses browser local storage so it remains usable
offline during development.

## Supabase

Run the **entire** [`supabase/schema.sql`](./supabase/schema.sql) file in one
Supabase SQL Editor query. Do not run only the selected section. This creates
the auth trigger and profile table required during registration.
The schema includes players, matches, match lineups, goals, and aggregate
player statistics. Every row is associated with the authenticated Supabase
user, and browser storage is also keyed by that user's ID, so rosters, team
layouts, match history, goals, assists, and appearances are private to each
username. The browser only uses the public anonymous key; never put a
Supabase service-role key in Vercel client-side environment variables.

In Supabase Authentication, use the Email provider for password-based auth and
disable email confirmations because XG does not collect email addresses. XG
creates an internal, non-deliverable login identifier for Supabase Auth while
the user only sees and enters a username. The profile trigger in the schema
stores the unique username separately.

## Vercel

Import the GitHub repository into Vercel, select the Vite framework preset, and
add the two `VITE_SUPABASE_*` environment variables for Preview and Production.
The included `vercel.json` rewrites client-side routes to `index.html`.
