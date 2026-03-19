# Pocket Detective

A personal finance app to track expenses, manage accounts, categorize transactions, and set budgets.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** PostgreSQL (Neon serverless) + Prisma 7
- **Auth:** NextAuth.js v5 (credentials + Google OAuth)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (English, Spanish)
- **Testing:** Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js (see [.nvmrc](.nvmrc) for version)
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client and apply migrations
npx prisma generate
npx prisma migrate dev

# Start dev server
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in & sign-up pages
│   ├── api/auth/            # NextAuth API route
│   ├── layout.tsx           # Root layout with i18n
│   └── page.tsx             # Home page
├── components/ui/           # shadcn/ui primitives
├── i18n/                    # Locale configuration
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── actions/auth.ts      # Auth server actions
│   └── prisma.ts            # Prisma client singleton
├── middleware.ts             # Auth route protection
└── __tests__/               # Unit tests
messages/
├── en.json                  # English translations
└── es.json                  # Spanish translations
prisma/
└── schema.prisma            # Database schema
```

## Data Model

All monetary values are stored as **cents (BigInt)**.

- **User** — root entity; all other models cascade-delete
- **FinancialAccount** — cash, checking, savings, credit, or investment
- **Category** — hierarchical (parent/child), scoped per user
- **Transaction** — expense, income, or transfer
- **Budget** — monthly spending target per category

## License

ISC
