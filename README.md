# iLearning — Unified Documentation

This repository contains the iLearning application: a subscription-driven learning platform with a TypeScript/Node backend and a modern Next.js frontend. This document consolidates high-level information from the backend and frontend READMEs and adds an explicit section describing the project's RAG (Retrieval-Augmented Generation) features and configuration.

## Live Links

- **Frontend**: https://ilearning-fe.vercel.app/

---

Contents
- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Key Features](#key-features)
- [Stripe Payment Integration](#stripe-payment-integration)
- [AI Quiz Generator](#ai-quiz-generator)
- [RAG (Retrieval-Augmented Generation)](#rag-retrieval-augmented-generation)
- [Setup & Local Development](#setup--local-development)
- [Environment & Configuration](#environment--configuration)
- [Database & Migrations](#database--migrations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [References](#references)

---

**Project Overview**

iLearning is a subscription-based education platform that provides role-aware experiences for students and administrators, subscription and payment management, AI-driven quiz generation, and RAG-powered knowledge features. The backend implements REST APIs, business logic, and persistence using Prisma and PostgreSQL. The frontend is a Next.js application responsible for the public site, authentication flows, premium feature UI, and AI integrations.

For full, detailed docs see the original READMEs:
- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)

---

**Architecture & Tech Stack**

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Stripe, Zod, Better Auth
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Genkit + Google GenAI integrations

The repository follows a modular, layered backend architecture: middleware → routes → feature modules → data access (Prisma) → database.

---

**Key Features**

- Role-based authentication and authorization (SUPER_ADMIN, ADMIN, INSTRUCTOR, STUDENT)
- Subscription plans, Stripe payment integration, webhook handling
- Premium gated features and access verification in frontend + backend
- AI-powered quiz generation (Genkit + Google GenAI)
- RAG-powered knowledge retrieval and assisted responses
- Redis-backed cache for repeated RAG queries before falling back to backend generation

---

**Stripe Payment Integration**

Overview

Stripe is the primary payment processor for iLearning, handling all subscription billing, payment transactions, and financial reporting. The platform integrates Stripe's REST API to manage payment methods, process charges, handle refunds, and track invoice history.

Key Features
- **Subscription Management**: Create, update, pause, and cancel customer subscriptions with flexible billing intervals (daily, monthly, yearly, lifetime).
- **Payment Processing**: Secure card processing via Stripe Hosted Payment Pages or API.
- **Webhook Handling**: Automated event handling for payment successes, failures, refunds, and subscription lifecycle events.
- **Invoice Tracking**: Automatic invoice generation and distribution to students; invoice URLs stored in the database.
- **Payment Status Tracking**: Real-time status updates (PAID, UNPAID) linked to subscriptions.
- **Retry Logic**: Built-in retry logic for failed payments with configurable retry schedules.

Integration Points
- Backend Stripe module: [backend/src/app/modules/payment](backend/src/app/modules/payment)
- Prisma payment model: [backend/prisma/schema/payment.prisma](backend/prisma/schema/payment.prisma)
- Webhook endpoint: `POST /api/v1/webhook` (Stripe event handler)

Payment Flow
1. **Subscription Creation**: Student selects a plan and initiates payment via the frontend.
2. **Payment Initiation**: Backend creates a Stripe PaymentIntent or initiates a subscription cycle.
3. **Charge Processing**: Stripe processes the charge and returns payment status.
4. **Webhook Notification**: Stripe sends a webhook event (e.g., `payment_intent.succeeded` or `customer.subscription.updated`).
5. **Database Update**: Backend receives webhook, verifies signature, and updates subscription/payment status in Prisma.
6. **User Notification**: Frontend is notified of payment status and grants/revokes premium access accordingly.

Configuration & Security
- **Environment**: Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in backend `.env`.
- **Webhook Signing**: Verify all webhook signatures using the Stripe webhook signing secret (`STRIPE_WEBHOOK_SECRET`) to prevent unauthorized requests.
- **Rate Limiting**: Apply rate limits to payment endpoints to prevent abuse.
- **PCI Compliance**: Do not handle raw card data; leverage Stripe's tokenization and hosted forms.

Example Payment Creation (Backend)
```typescript
// Initiate Stripe subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: stripePriceId }],
  payment_behavior: 'default_incomplete',
});

// Store external reference in Prisma
await prisma.subscription.update({
  where: { id: subscriptionId },
  data: { externalRef: subscription.id, paymentProvider: 'stripe' },
});
```

Admin & Reporting
- View all payments and subscription history from the admin dashboard.
- Export payment reports for accounting and reconciliation.
- Monitor failed payments and retry activity.

---

**AI Quiz Generator**

Overview

The AI Quiz Generator is a premium feature that leverages generative AI to dynamically create customized quizzes tailored to student learning needs. Using Genkit as the orchestration layer and Google GenAI models, the platform generates engaging, contextually relevant questions and answers on-the-fly.

Key Features
- **Dynamic Content Generation**: Generate unlimited, unique quiz questions from course materials or custom topics.
- **Customizable Parameters**: Specify difficulty level, number of questions, topic, and question type (multiple-choice, short-answer, etc.).
- **Genkit + Google GenAI**: Built on Genkit for reliable model orchestration and Google's state-of-the-art language models (`@genkit-ai/google-genai`, `@genkit-ai/googleai`).
- **Quiz History**: Automatically track and store all generated quizzes with timestamps and performance scores.
- **Premium Gating**: Quiz generation is restricted to authenticated users with valid, active premium subscriptions.
- **Instant Feedback**: Immediate grading and feedback on quiz responses.

Integration Points
- Backend RAG/AI module: [backend/src/app/modules/rag](backend/src/app/modules/rag) (or dedicated `ailearn` module if separated)
- Frontend quiz page: [frontend/src/app/(dashboardLayout)/dashboard/premium-feature](frontend/src/app/%28dashboardLayout%29/dashboard/premium-feature)
- Quiz history UI: [frontend/src/app/(dashboardLayout)/dashboard/quiz-history](frontend/src/app/%28dashboardLayout%29/dashboard/quiz-history)
- Genkit & Google GenAI integration: [frontend/src/services/iquiz.service.ts](frontend/src/services/iquiz.service.ts)

Generation Flow
1. **User Request**: Student accesses premium quiz page and enters topic/parameters.
2. **Premium Check**: Backend/frontend verifies active subscription and premium access.
3. **Genkit Orchestration**: Genkit routes the request to the configured Google GenAI model.
4. **Generation**: Model generates questions, answers, and explanations based on parameters.
5. **Storage**: Quiz metadata and questions are saved to the database with `createdAt` and `studentId` for history tracking.
6. **Display**: Frontend renders quiz UI with questions and captures student responses.
7. **Grading**: Backend evaluates responses and returns score + feedback.
8. **History**: Quiz is logged in quiz history for later review.

Configuration & Environment
- **Genkit Setup**: Install and configure Genkit in the backend/frontend.
- **Google GenAI Credentials**: Set `GOOGLE_GENAI_API_KEY` and related model identifiers in `.env`.
- **Model Selection**: Configure the default model (e.g., `gemini-pro`, `gemini-vision`) in environment or config file.
- **Rate Limiting**: Limit quiz generation requests per user per day to manage API costs.

Example Quiz Generation (Backend)
```typescript
import { generate } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';

const quizPrompt = `Generate 5 multiple-choice quiz questions on the topic "${topic}" at difficulty "${difficulty}". Return as JSON.`;

const quiz = await generate({
  model: googleAI('gemini-pro'),
  prompt: quizPrompt,
});
```

Frontend Integration (Next.js Server Actions)
- Quiz generation triggered via Server Actions to secure API calls.
- Loading states and error boundaries prevent broken UX.
- Real-time feedback with Sonner toast notifications.

Quiz Data Model (Prisma)
- `Quiz`: Quiz metadata (id, studentId, topic, difficulty, totalQuestions, score, createdAt, completedAt)
- `QuizQuestion`: Individual questions and correct answers (id, quizId, questionText, options, correctAnswer, explanation)
- `QuizResponse`: Student's answers for grading and analytics (id, questionId, studentAnswer, isCorrect)

Security & Compliance
- **Subscription Validation**: Enforce premium access on both frontend and backend.
- **Cost Control**: Monitor API usage and token consumption to prevent unexpected billing.
- **Data Privacy**: Ensure quiz content adheres to data protection and IP policies.
- **Audit Logging**: Log quiz generation requests with user ID and timestamp for compliance.

Performance Optimization
- **Caching**: Cache frequently generated quiz topics to reduce API calls.
- **Batch Generation**: Support bulk quiz generation for admin/instructor use (optional feature).
- **Async Processing**: Use background jobs for large or complex generations.

---

**RAG (Retrieval-Augmented Generation)**

Overview
:
Retrieval-Augmented Generation (RAG) augments generative models with retrieval from a knowledge store so responses are grounded in your data. In iLearning, RAG is used to provide context-aware AI assistance (for support, course help, or content augmentation) by combining an indexed corpus (course content, docs, FAQs, transcripts) with an LLM to generate precise, sourced answers.

Key components in this repo
- Prisma schema for RAG-related persistence: [backend/prisma/schema/rag.prisma](backend/prisma/schema/rag.prisma)
- Backend module and API surface: [backend/src/app/modules/rag](backend/src/app/modules/rag)
- Frontend integration points: premium AI pages and support widgets under [frontend/src/app](frontend/src/app)
- Redis cache client and cache-first query flow in [backend/src/lib/redis.ts](backend/src/lib/redis.ts) and [backend/src/app/modules/rag/rag.controller.ts](backend/src/app/modules/rag/rag.controller.ts)

Typical RAG flow implemented by the project
1. Ingest: Content is ingested (documents, course content, FAQs) and optionally chunked.
2. Embed: Each chunk is converted to an embedding vector using the chosen embedding model (OpenAI embeddings, Google embeddings, or any configured provider).
3. Index: Embeddings are stored in a vector index (a managed vector DB such as Pinecone, or a self-hosted store). The system records metadata and references in Prisma for traceability.
4. Retrieve: At query time, the retriever searches the vector index for top-K relevant passages using cosine similarity (or configured metric).
5. Generate: Retrieved passages are passed to the LLM along with a prompt template to produce a grounded response; the LLM output is returned to the client with provenance metadata (source ids/URLs/snippets).

Configuration and environment
- Vector database: optionally set up Pinecone, Weaviate, Redis, or a local vector store; configure provider connection in backend env (see `Environment & Configuration` below).
- Embedding model credentials: configure the embedding provider (OpenAI, Google, etc.) via environment variables.
- LLM provider credentials: configure model keys for generation in the backend.
- Redis cache: set `REDIS_URL` in the backend environment to enable cache-first chatbot responses.

Endpoints & usage
- Indexing endpoint(s) typically live in the backend `rag` module and support: bulk indexing, single-document indexing, and status checks.
- Query endpoints provide search + generation: they accept a user query and return a generated, sourced answer.

Security & cost controls
- Rate-limit RAG queries and restrict generation to authenticated users or premium roles.
- Enforce prompt and token limits to control API costs.

Best practices & notes
- Store raw source references and snippet offsets so results can be traced back to the original document.
- Periodically re-index when content changes; keep embeddings in sync with content updates.
- Add fallback behavior when the retriever returns low-relevance results (e.g., respond with a safe fallback prompt and links to docs).

---

**Setup & Local Development**

Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL (or configured DB)

Backend (quick)
1. Navigate to the backend folder and install dependencies:

```powershell
cd backend
pnpm install
```

2. Copy and configure environment variables (see `Environment & Configuration`).
3. Run migrations and seed (if provided):

```powershell
pnpm --filter backend prisma migrate deploy
pnpm --filter backend run seed
pnpm --filter backend dev
```

Frontend (quick)
1. From repo root:

```powershell
cd frontend
pnpm install
pnpm dev
```

2. Ensure `NEXT_PUBLIC_API_URL` points to your running backend (e.g., `http://localhost:5000`).

---

**Environment & Configuration**
Create `.env`/.env.local files for each app and set at minimum:

- Backend env (examples)
  - `DATABASE_URL` — PostgreSQL connection URL
  - `PORT` — backend port
  - `STRIPE_SECRET_KEY` — Stripe API key
  - `EMBEDDING_PROVIDER` — e.g., `openai` or `google`
  - `EMBEDDING_API_KEY` — embedding service key
  - `LLM_PROVIDER` — model provider for generation
  - `VECTOR_DB_PROVIDER` — e.g., `pinecone`, `weaviate`, `redis` (if used)

- Frontend env (examples)
  - `NEXT_PUBLIC_API_URL` — backend API root

Refer to [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for additional, module-specific variables.

---

**Database & Migrations**

Prisma is used for schema and migrations. Schemas are modularized under `backend/prisma/schema`. To run migrations:

```powershell
cd backend
pnpm --filter backend prisma migrate dev
```

---

**Deployment**

- Frontend: recommended to deploy on Vercel (project already set up for Vercel).
- Backend: deploy as a Node service (Vercel Serverless, DigitalOcean App, or containerized service). Ensure environment variables and the vector DB (if used) are available in production.

---

**Contributing**

- Follow the existing code style and testing conventions used in each package.
- For RAG-related contributions, add clear migration steps for any new persisted metadata and tests for the retriever/generation flow.

---

**References**
- Backend README: [backend/README.md](backend/README.md)
- Frontend README: [frontend/README.md](frontend/README.md)

---

If you'd like, I can:
- add example env files for backend/frontend,
- generate an example RAG indexing script, or
- add an OpenAPI spec for the RAG endpoints.
