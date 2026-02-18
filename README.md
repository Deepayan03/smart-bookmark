# Smart Bookmark App

A modern full-stack bookmark manager built using Next.js App Router, Supabase, and TypeScript.

This project was developed as an assignment for Abstrabit Technologies.

This application allows users to securely log in using Google OAuth and manage their personal bookmarks in real time.

The goal of this project was not just to build a bookmark app, but to deeply understand:

- Authentication flows
- Database design
- Row Level Security (RLS)
- Realtime subscriptions
- Hydration issues in Next.js
- Proper separation of client and server logic
- Production deployment using Vercel

---

# Tech Stack

Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Backend:
- Supabase (PostgreSQL Database)
- Supabase Auth (Google OAuth)
- Supabase Realtime
- Row Level Security (Manual Policies)

Deployment:
- Vercel

---

# System Architecture

High Level Architecture:

User (Browser)
    |
    v
Next.js Frontend (Client Components)
    |
    v
Supabase Client SDK
    |
    v
Supabase Services
    - Auth
    - PostgreSQL Database
    - Realtime Engine
    |
    v
Row Level Security (RLS Enforcement)

---

# Detailed Architecture Diagram

                    ┌───────────────────────┐
                    │        Browser        │
                    │  React + Next.js App  │
                    └───────────┬───────────┘
                                │
                                v
                    ┌───────────────────────┐
                    │  Supabase JS Client   │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                v                               v
     ┌───────────────────┐           ┌───────────────────┐
     │   Supabase Auth   │           │  PostgreSQL DB    │
     │  (Google OAuth)   │           │   bookmarks table │
     └───────────┬───────┘           └───────────┬───────┘
                 │                               │
                 v                               v
          Session Token                 Row Level Security
                                             (auth.uid())

Realtime Engine listens to DB changes and pushes events back to client.

---

# Folder Structure (Simplified)

app/
  page.tsx
  layout.tsx

components/
  Navbar.tsx
  BookmarkBoard.tsx
  BookmarkList.tsx
  BookmarkCard.tsx
  AddBookmarkForm.tsx
  AddModal.tsx
  ConfirmDeleteModal.tsx

lib/
  supabaseClient.ts

---

# Database Design

Table: bookmarks

Columns:
- id (uuid, primary key)
- title (text)
- url (text)
- user_id (uuid, references auth.users)
- created_at (timestamp)

Important: Every bookmark is tied to a specific user_id.

---

# Row Level Security (RLS)

RLS is enabled on the bookmarks table.

Policies created manually:

1. Allow users to SELECT their own bookmarks
2. Allow users to INSERT only if user_id = auth.uid()
3. Allow users to DELETE only their own bookmarks

This ensures complete data isolation between users.

---

# Authentication Flow (Detailed)

1. User clicks "Login with Google"
2. Supabase redirects to Google OAuth
3. Google verifies identity
4. Supabase creates session
5. User redirected back to app
6. Supabase client stores session
7. Application fetches bookmarks using session

Authentication Flow Diagram:

User
  |
  v
Login Button
  |
  v
Supabase OAuth Redirect
  |
  v
Google Authentication
  |
  v
Supabase Creates Session
  |
  v
Redirect to App
  |
  v
Session Available in Client
  |
  v
Fetch User Bookmarks

---

# API Flow Explanation

Although Supabase abstracts raw REST APIs, internally these flows occur.

## 1. Fetch Bookmarks

Client:
supabase.from("bookmarks").select("*")

Flow:
Client
  |
  v
Supabase JS SDK
  |
  v
Supabase REST API
  |
  v
PostgreSQL with RLS
  |
  v
Filtered Results Returned

RLS ensures:
Only rows where user_id = auth.uid() are returned.

---

## 2. Insert Bookmark

Client:
supabase.from("bookmarks").insert({...})

Flow:
Client
  |
  v
Supabase SDK
  |
  v
Insert Query
  |
  v
RLS Policy Check
  |
  v
Row Inserted
  |
  v
Realtime Event Triggered
  |
  v
Client Receives INSERT Event

---

## 3. Delete Bookmark

Client:
supabase.from("bookmarks").delete().eq("id", bookmarkId)

Flow:
Client
  |
  v
Supabase SDK
  |
  v
Delete Query
  |
  v
RLS Policy Check
  |
  v
Row Deleted
  |
  v
Realtime DELETE Event Triggered
  |
  v
Client Removes Item From State

---

# Realtime Event Flow

Client subscribes to:

supabase.channel("bookmarks")
.on("postgres_changes", ...)

Realtime Flow:

Database Change
  |
  v
Supabase Realtime Engine
  |
  v
WebSocket Event
  |
  v
Client Listener
  |
  v
State Updated

Event Types Handled:
- INSERT
- DELETE

---

# Major Problems Faced and How They Were Solved

## 1. Hydration Failed Error

Problem:
Server-rendered HTML did not match client-rendered HTML.

Cause:
Using session-dependent logic during SSR.

Solution:
- Moved Supabase logic into client components
- Ensured no session-dependent rendering during server phase

Lesson:
Server and client rendering must produce identical initial HTML.

---

## 2. Realtime Insert Working Sometimes

Problem:
New bookmarks appeared inconsistently.

Cause:
Multiple subscriptions due to improper useEffect setup.

Solution:
- Created subscription once
- Cleaned up on unmount
- Correct dependency management

Lesson:
Realtime systems must avoid duplicate listeners.

---

## 3. Realtime Delete Not Working

Problem:
Deletion did not reflect in UI.

Cause:
Incorrect usage of payload.old.id.

Solution:
Correctly filtered state using:
bookmarks.filter(b => b.id !== payload.old.id)

Lesson:
Realtime payload structures must be carefully inspected.

---

## 4. RLS Blocking Inserts

Problem:
Insert queries failing silently.

Cause:
user_id was not matching auth.uid().

Solution:
Explicitly passed session user id during insert.

Lesson:
Database security must align exactly with application logic.

---

## 5. Session Not Immediately Available

Problem:
Session sometimes null after redirect.

Cause:
Session hydration delay.

Solution:
Waited for Supabase client to initialize before fetching data.

Lesson:
Authentication state is asynchronous.

---

## 6. State Sync Issues

Problem:
Rapid operations caused inconsistent UI.

Cause:
Non-functional state updates.

Solution:
Used functional updates:
setBookmarks(prev => [...prev, newBookmark])

Lesson:
Always use functional updates when relying on previous state.

---

# Security Considerations

- Strict RLS policies
- No public bookmark access
- Environment variables secured
- No sensitive keys committed
- User isolation enforced at database level

---

# Deployment

Hosted on Vercel.

Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Production build verified.

---

# What This Project Demonstrates

- Understanding of authentication flows
- Practical use of Row Level Security
- Realtime database event handling
- State synchronization strategies
- Hydration debugging in Next.js
- Full-stack architecture understanding
- Secure production deployment practices


---

# Conclusion

This project represents a practical, production-style full-stack application.

It demonstrates understanding of:

- Authentication systems
- Secure database architecture
- Realtime data synchronization
- Client-server rendering boundaries
- State consistency
- Deployment workflows

