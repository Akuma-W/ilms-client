# Interactive LMS Frontend

## Description

The frontend of Interactive LMS is a modern web application built with Next.js 16 (App Router) and React 19. It provides an intuitive UI for teachers, students, and admins to interact with the learning platform, leveraging Tailwind CSS v4, shadcn/ui components, Zustand state management, and SWR data fetching.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, shadcn/ui, Tailwind CSS v4, Lucide React, Radix UI
- **State Management**: Zustand 5
- **Data Fetching**: SWR 2.4.1
- **Form & Validation**: React Hook Form, Zod
- **Animations**: Motion, tw‑animate‑css
- **Package Manager**: npm (or pnpm)
- **DevOps**: Docker for development environment (optional)

## Features

- Responsive, server‑side rendered pages with dynamic routing.
- Authentication flow integrated with the backend API (JWT, Google OAuth).
- Real‑time UI updates using SWR revalidation.
- Component library based on shadcn/ui for consistent design.
- State management for global UI state (theme, user session) via Zustand.
- Form handling with validation and error messages.
- Accessible UI components following WCAG standards.

## Installation & Run

```bash
# Clone the repository (if not already)
git clone https://github.com/your-username/interactive-lms.git
cd ilms-client

# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev
```

> **Tip**: Ensure the backend API is running (see the server README) so the frontend can fetch data.

## Folder Structure

```text
ilms-client/
├─ src/
│  ├─ app/            # Next.js App Router pages
│  ├─ components/     # Reusable UI components
│  ├─ hooks/          # Custom React hooks (e.g., useAuth)
│  ├─ lib/            # Utilities, API client wrappers
│  ├─ stores/         # Zustand stores
│  └─ styles/         # Global CSS, Tailwind config
├─ public/            # Static assets (images, fonts)
├─ .env.example       # Example environment variables
├─ next.config.ts     # Next.js configuration
├─ tailwind.config.ts # Tailwind configuration
└─ tsconfig.json      # TypeScript configuration
```

For a complete overview, see `docs/05-ui-ux/design-system.md`.

## Contact & Contribution

- **Author**: Trần Tuấn Phong
- **Email**: <tuanphongbrvt1@gmail.com>

Contributions are welcome! Please read the contribution guidelines in `docs/09-project-management/implementation-status.md` before submitting a pull request.

## License

This project is licensed under the MIT License – see the `LICENSE` file at the repository root.
