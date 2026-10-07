# Souqivo

**One workspace from kickoff to approval.**

Souqivo is a client collaboration workspace for freelancers, agencies, and their clients. It brings projects, tasks, reviews, files, messages, and invoices together in one shared workspace.

## Live Demo

**[souqivo.com](https://souqivo.com)**

## Screenshots

Screenshots are not currently included in this repository. Add real captures here when available:

- Landing page
- Freelancer dashboard
- Project workspace
- Task board
- Review workflow
- Client experience
- Invoice
- Mobile experience

## Features

### Authentication

- Email and password signup and login
- Freelancer/agency or client role selection at signup
- Password recovery and reset flows
- Protected workspace routes

### Projects and clients

- Freelancers create, edit, and delete projects
- Project status, progress, description, and deadline
- Add existing client accounts to a project and remove project members
- Project overview with member information, task progress, resource counts, and recent activity
- Clients see projects to which they have been added

### Tasks

- Create, edit, and delete project tasks
- Task status, priority, description, and due date
- Drag-and-drop Kanban board for freelancer task management
- Clients can view project tasks and status

### Reviews

- Submit a deliverable link with a title and description for client review
- Clients can approve a pending review or request changes with a comment
- Review status and client feedback remain visible in the project
- A review can only be responded to while pending; a concurrent or repeated response receives a conflict response

### Files

- Upload project files directly (up to 10 MB) or add an external HTTP/HTTPS link
- File type labels and open-file actions
- Uploaded files are opened through short-lived signed URLs
- Freelancers manage project files; project clients can access them

### Messaging

- Project-scoped conversations
- Realtime message insertion and deletion updates
- A sender can delete their own messages
- Sending a message also updates the conversation from the API response

### Invoices

- Freelancers create, edit, and delete project invoices
- Invoice number, recipient, project, amount, description, issue date, due date, and status
- Clients can view invoices addressed to them on projects they belong to
- Invoice status display includes Draft, Pending, Paid, and Overdue

### Notifications

- Per-user notification list with read/unread state
- Mark a notification read or mark all as read
- Notifications link to the relevant project area where available

### Settings

- View account email and role
- Update profile name

## Roles

### Freelancer

Can create and manage projects, add or remove project clients, manage tasks and reviews, manage project files, communicate with project clients, and create and manage invoices.

### Client

Can access assigned projects, view project progress and tasks, access project files, respond to pending deliverable reviews, communicate in project conversations, and view invoices addressed to them.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Web application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Data and identity | Supabase Auth, Supabase PostgreSQL, Supabase Storage, Supabase Realtime |
| Drag and drop | dnd-kit |
| Icons | Lucide React |

The repository does not include React Hook Form, Zod, Recharts, or a deployment-provider package.

## Architecture

- App Router pages and layouts use server components for authenticated data access and initial rendering; client components provide form, drag-and-drop, notification, and realtime interactions.
- Supabase server and browser clients are kept in separate modules. Server API route handlers authenticate requests and enforce role, project ownership, or project membership checks for protected operations.
- Shared TypeScript models describe projects, members, tasks, reviews, files, messages, invoices, and users.
- Supabase data-access helpers are used by pages and route handlers; reusable UI components provide shared form, navigation, status, and feedback patterns.
- Project files use project-scoped storage paths and short-lived signed URLs. Messaging combines initial server-loaded history, API sends, and Supabase Realtime updates.
- Dashboard resource reads are batched across accessible project IDs to avoid one query per project for each resource type.

## Security and Access Control

The application includes server-side authentication checks, role-specific mutation rules, project ownership and membership checks, and request validation in API route handlers. Additional protections include:

- Invoice reads are scoped to owned projects or client memberships and the client's recipient ID.
- Review responses are restricted to project clients and pending reviews; competing responses are handled with a conflict response.
- Message deletion verifies the sender and project access.
- File reads and signed URL creation verify project access; uploaded-file signed URLs expire after ten minutes.
- External file links are limited to HTTP or HTTPS URLs.
- The application sets `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` response headers.
- The browser uses only the Supabase URL and publishable key; `.env.local` is ignored by Git and should not be committed.

**Deployment note:** This repository does not contain Supabase schema migrations, RLS policies, storage policies, or RPC definitions. Those database and storage controls cannot be verified from the repository; the corresponding Supabase environment must be configured for a working deployment.

## Engineering Highlights

- Role-aware project access with ownership and client membership checks.
- Kanban task movement persists status through the API and reports failed updates.
- Review responses are conditional on the current pending state, including handling concurrent response attempts.
- Signed file URLs are issued only after application-level project access checks.
- Realtime message events are deduplicated against messages added from the send response.
- Data-read errors are surfaced rather than being presented as successful empty results.
- Dashboard reads for tasks, reviews, messages, and files are batched across accessible projects.

## UX and Design

The workspace uses reusable UI components, consistent typography and status treatments, role-aware navigation, and responsive layouts. Forms, actions, and major workspace pages include loading, empty, and error feedback; interactive controls include labels and keyboard focus treatments.

## Local Development

### Requirements

- Node.js and npm
- A Supabase project with the application schema, required RPC functions, and storage configuration available

### Setup

```bash
git clone https://github.com/adilfarooq97/clientflow.git
cd clientflow
npm install
```

Create `.env.local` in the repository root and set the required Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local` or put service-role keys in `NEXT_PUBLIC_` variables. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup note

The application expects a Supabase environment containing its tables, policies, storage bucket, and RPC functions. Their definitions are not included in this repository, so a developer needs access to a configured Supabase project; this README does not provide or invent setup SQL.

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Start the production build locally |

## Project Status

Souqivo is a completed portfolio project and production-style prototype. It demonstrates a multi-role project workflow; it is not presented here as a commercial SaaS with customers or usage metrics.

## Known Limitations

- Database schema, Supabase RLS and storage policies, and RPC definitions are not tracked in this repository.
- Running authenticated workflows requires a configured Supabase environment; production access policies need verification in that environment.
- No application screenshots or production demo URL are included yet.

## Future Work

- Add genuine product screenshots and the production demo URL.
- Document and version the Supabase schema, policies, storage setup, and RPC functions alongside the application.
