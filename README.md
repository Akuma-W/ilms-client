# Interactive LMS Frontend

![Interactive LMS Logo](./src/assets/images/logo.svg)

Interactive LMS Frontend is a modern web application built with Next.js 16 and React 19. It delivers an intuitive, responsive learning platform connecting students, teachers, and administrators with interactive classrooms, real-time collaboration, and AI-assisted study tools.

## Tech Stack

- **Language & Framework**: TypeScript `^5.9.3`, Next.js `^16.2.1` (App Router, Standalone), React `19.2.3`
- **UI & Styling**: Tailwind CSS `^4.2.2`, shadcn/ui `^3.8.5`, Radix UI `^1.4.3`, Lucide React `^0.576.0`, Sonner `^2.0.7`
- **Animations**: Motion `^12.38.0`, tw-animate-css `^1.4.0`
- **State & Data Fetching**: Zustand `^5.0.12` (Global state), SWR `^2.4.1` (Data fetching & caching)
- **Forms & Validation**: React Hook Form `^7.72.0`, Zod `^4.3.6`
- **DevOps**: Docker & Docker Compose (Multi-stage build)

## Features

- **Authentication**: JWT HttpOnly cookies and Google OAuth2 integration with role-based onboarding.
- **Classroom Management**: Join classes via 6-character code or QR code, view class rosters, and member tracking.
- **Learning Materials**: Topic-based hierarchy, document preview, and video streaming (YouTube, Drive, MinIO).
- **Assignments & Submissions**: Homework tracking, S3 file uploads, and late submission handling.
- **Interactive Quizzes**: Timed quiz participation, instant scoring, and performance review.
- **Collaboration**: 1-click Google Meet sessions, discussion forums with anonymous posting, and messaging.
- **AI Assistant**: Contextual Q&A sidebar, automated quiz generation, and study recommendations.
- **Analytics & Highlights**: Class progress dashboards and 24-hour urgent task detection.

## Installation & Run

### Prerequisites

- Node.js `>= 20.x`
- npm `>= 10.x`
- Backend API (`ilms-server` running on `<http://localhost:5000/api/v1>`)

### 1. Clone Project

```bash
git clone https://github.com/Akuma-W/ilms-client.git
cd ilms-client
```

### 2. Setup Environment

Create local `.env` file:

```bash
cp .env.example .env
```

Configure `.env`:

```env
NEXT_PUBLIC_CLIENT_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SERVER_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
CLIENT_PORT=3000
APP_DOMAIN=localhost
```

### 3. Running with Docker

```bash
docker compose up -d --build
```

Accessible at `<http://localhost:3000>`.

### 4. Running for Local Development

```bash
npm install
npm run dev
```

Open `<http://localhost:3000>` in your browser.

## Folder Structure

```text
ilms-client/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   ├── assets/             # Bundled static assets
│   ├── components/         # Shared UI components and shadcn/ui primitives
│   ├── config/             # Navigation and app constants
│   ├── features/           # Domain feature modules (auth, classes, school, user)
│   ├── hooks/              # Custom reusable React hooks
│   ├── lib/                # API client and utility helpers
│   ├── locales/            # Internationalization dictionaries
│   ├── stores/             # Zustand global state stores
│   └── types/              # TypeScript type definitions
├── .dockerignore           # Docker build ignore rules
├── .env.example            # Environment template
├── Dockerfile              # Multi-stage production container
├── docker-compose.yaml     # Docker compose service definition
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Contribution

- Contact and contributions:
  - Author: Tran Tuan Phong
  - Email: <tuanphongbrvt1@gmail.com>
  - GitHub: [Akuma-W](https://github.com/Akuma-W)

## Lisence

This project is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute this software for educational, academic, and study purposes.
