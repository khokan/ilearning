# iLearn Frontend

A modern Next.js frontend for the iLearn platform. This application delivers role-based experiences for students and admins, subscription-driven premium access, AI quiz generation, and a clean dashboard experience built with a production-ready React stack.

## Live Links

- Frontend: https://ilearning-fe.vercel.app/
- Frontend GitHub: https://github.com/khokan/ilearning-fe.git
- Backend GitHub: https://github.com/khokan/ilearning-be.git

## Overview

iLearn is an education platform focused on structured learning, premium study tools, and guided user flows. The frontend is responsible for:

- public landing pages and authentication screens
- student dashboard and subscription management
- premium feature access control
- AI quiz generation and quiz history
- profile, password, and account settings
- admin views for managing platform data

The application is built with a clear separation between public, common, and dashboard layouts, making the codebase easier to scale and maintain.

## Key Features

- Role-aware navigation and routing
- Subscription-based premium feature access
- Expired subscription handling with resubscribe flow
- AI quiz generator with quiz history
- Student dashboard for subscription overview
- Profile and password management
- Admin dashboard pages
- Server Actions for form and mutation handling
- Toast-based feedback for async actions
- Responsive UI with shadcn/ui and Tailwind CSS

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- TanStack Query
- React Hook Form
- Zod
- Sonner
- Axios
- Genkit
- @genkit-ai/google-genai
- @genkit-ai/googleai

## Project Structure

```text
src/
  app/
    (commonLayout)/
    (dashboardLayout)/
    api/
    globals.css
    layout.tsx
    page.tsx
  actions/
  components/
    modules/
    shared/
    ui/
  lib/
  providers/
  services/
  types/
  utils/
  zod/
```

## Main Routes

### Public

- `/` - landing page
- `/login` - sign in
- `/register` - sign up

### Student Dashboard

- `/dashboard` - subscription overview
- `/dashboard/subscription` - manage plans and subscription status
- `/dashboard/premium-feature` - premium quiz generator
- `/dashboard/quiz-history` - past quizzes
- `/dashboard/profile` - profile details
- `/dashboard/payment/success` - payment success state
- `/change-password` - password update
- `/my-profile` - personal profile

### Admin

- `/admin/dashboard` - admin overview
- `/admin/dashboard/users` - manage users
- `/admin/dashboard/subscriptions` - manage subscriptions

## Subscription Flow

The frontend is designed to work with time-based subscriptions from the backend.

- A user can purchase a plan from the subscription page.
- Active subscriptions unlock premium features.
- Once a subscription expires, premium access is blocked automatically.
- The UI shows a `Subscribe Again` action so the user can create a fresh subscription.
- The premium quiz page redirects back to the subscription page if access is not valid.

## AI Quiz Generation

The premium quiz experience is powered by Genkit and Google GenAI integrations.

- Genkit is used as the orchestration layer for AI quiz generation.
- `@genkit-ai/google-genai` and `@genkit-ai/googleai` provide the model integration used to generate quiz content.
- The premium quiz page requires a valid subscription before AI quiz generation is available.

## Setup

### Prerequisites

- Node.js 20 or newer
- pnpm
- Backend API running and accessible

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the frontend project root and configure the API endpoint used by the app.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If your backend uses additional auth or app-specific variables, add them here as needed.

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Lint

```bash
pnpm lint
```

## Backend Integration

The frontend consumes the backend API for:

- authentication and session management
- subscription creation and retrieval
- payment initiation
- premium access validation
- quiz-related data and history

Backend repository:
https://github.com/khokan/ilearn-be.git

## Deployment

This frontend is deployed on Vercel:

https://ilearn-fed.vercel.app/

## Notes

- Premium access is enforced on the frontend and backend.
- Expired subscriptions are treated as invalid access and must be renewed.
- The project uses server-side data fetching where appropriate to keep auth and subscription state consistent.

## License

This project is provided for educational and demonstration purposes.
