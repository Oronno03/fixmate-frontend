# FixMate Frontend

FixMate is a repair-service marketplace where customers book verified technicians for smartphones, laptops, ACs, refrigerators, TVs, washing machines, and electrical work. Customers track each job through a live timeline and pay securely with Stripe only after the work is completed.

- **Live app:** [https://fix-mate-front-end.vercel.app/](https://fix-mate-front-end.vercel.app/)
- **Backend API repo:** [https://github.com/Oronno03/fixmate-backend](https://github.com/Oronno03/fixmate-backend)
- **Frontend repo:** [https://github.com/Oronno03/fixmate-frontend](https://github.com/Oronno03/fixmate-frontend)

## Admin credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fixmate.com` | `Admin@123` |

Demo technician and customer accounts are also seeded:

| Role | Email | Password |
| --- | --- | --- |
| Technician (Pro) | `rahim@fixmate.com` | `Tech@123` |
| Technician (Free) | `karim@fixmate.com` | `Tech@123` |
| Customer | `customer@fixmate.com` | `Customer@123` |

## Key features

- **Verified repair marketplace** — browse 14+ seeded services across seven categories with pricing, duration, service area, and technician details.
- **Role-based dashboards** — separate experiences for customers, technicians, and admins, with server-side route guards.
- **Booking lifecycle** — request a repair, accept or reject it as a technician, and move it through requested → accepted → in progress → completed.
- **Live job timeline** — every booking shows a status timeline with timestamps and a final paid step.
- **Stripe payments after completion** — customers pay only once a job is complete; payment success and cancellation pages are included.
- **PDF invoices** — authenticated, server-generated invoices can be downloaded from booking and payment views.
- **Ratings and reviews** — customers can review completed and paid jobs; average rating and review count appear on service listings.
- **Server-side pagination** — service listings are paginated and sortable through the API, with accessible page controls.
- **Dark and light themes** — dark is the default FixMate palette, with a persisted light theme toggle.
- **FixMate Pro technician plan** — technicians can upgrade through Stripe Checkout for unlimited listings; free accounts are limited to three services and Pro listings show a verified badge.
- **Admin tools** — manage users, services, bookings, transactions, and view marketplace statistics.
- **Image uploads** — service images are uploaded through ImgBB.
- **Authentication** — BetterAuth email/password sessions with JWT access tokens for the Express API.

## Tech stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4 with shadcn/base-ui components
- BetterAuth for authentication
- SWR for client-side data fetching
- next-themes for theme switching
- Recharts for dashboard charts
- Sonner for toast notifications
- Zod for validation

### npm packages used

**Runtime**

| Package | Purpose |
| --- | --- |
| `next` | App Router, server components, API routes, and rendering |
| `react`, `react-dom` | UI runtime |
| `better-auth`, `@better-auth/mongo-adapter` | Email/password authentication and MongoDB session storage |
| `mongodb` | MongoDB driver used by BetterAuth |
| `@base-ui/react` | Accessible unstyled UI primitives behind the shadcn components |
| `shadcn` | Component CLI and generated component conventions |
| `class-variance-authority` | Variant-based component styling |
| `cn` | Conditional class name helper |
| `lucide-react` | Icon set |
| `next-themes` | Dark/light theme persistence |
| `swr` | Data fetching, caching, and revalidation |
| `recharts` | Admin dashboard charts |
| `sonner` | Toast notifications |
| `zod` | Form and API payload validation |
| `tw-animate-css` | Tailwind animation utilities |

**Development**

| Package | Purpose |
| --- | --- |
| `typescript`, `@types/*` | Type checking |
| `eslint`, `eslint-config-next` | Linting |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling and build integration |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend API is expected at `http://localhost:5000`.

### Environment variables

Create `.env.local`:

```bash
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
MONGODB_URI=your-mongodb-connection-string
```

## Scripts

```bash
npm run dev    # start the development server
npm run build  # create a production build
npm start      # serve the production build
npm run lint   # run ESLint
```
