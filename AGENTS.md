# AGENTS.md — INTERACTIVE LMS CLIENT (FRONTEND)

> Engineering rules, architecture constraints, code style, and development workflows for AI Agents working within `ilms-client/`.
>
> **Core Principle:** Maintain modular feature architecture, enforce clean hydration and page-rendering boundaries, preserve the Galaxy design system, and write maintainable, type-safe code with concise English documentation.

---

## 1. TECHNOLOGY STACK OVERVIEW

| Technology             | Version / Configuration                                 | Purpose                                         |
| ---------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| **Framework**          | Next.js `^16.2.1` (App Router)                          | Core web application framework                  |
| **Runtime Library**    | React `19.2.3`, React DOM `19.2.3`                      | UI component library                            |
| **Language**           | TypeScript `^5.9.3`                                     | Strict type safety                              |
| **Styling**            | Tailwind CSS `^4.2.2` (`@tailwindcss/postcss`)          | CSS engine configured via `@theme inline`       |
| **UI Components**      | shadcn/ui `^3.8.5` (style: new-york, Radix UI, Base UI) | Pre-built accessible components                 |
| **Icons & Animations** | Lucide React (`^0.576.0`), Motion (`^12.38.0`)          | Icons and motion transitions                    |
| **Client State**       | Zustand `^5.0.12`                                       | Lightweight global client state management      |
| **Data Fetching**      | SWR `^2.4.1`                                            | Client-side caching, revalidation, and mutation |
| **Form & Validation**  | React Hook Form `^7.72.0`, Zod `^4.3.6`                 | Form state and client input validation          |

---

## 2. CODE STYLE & CODING STANDARDS

### 2.1. English Language Standard & Single-Line Comments

- **Identifiers:** All variables, constants, functions, classes, interfaces, types, components, and files MUST be named in English.
- **Comments:** All code comments MUST be in English.
- **Single-Line `//` Comment Convention:** Use single-line `//` comments exclusively in `service` files, `lib/` utilities, and `hooks/`. Avoid multi-line `/** ... */` blocks. Keep explanations to 1 concise line stating the primary intent.
- **User-Facing Content:** User-facing labels, form error messages, and toast notifications should be in Vietnamese (centralized in `src/locales/vi/`).

```typescript
// Fetches user-enrolled classes with pagination and optional search filter
export async function getEnrolledClasses(params: ClassQueryParams): Promise<Class[]> { ... }
```

### 2.2. Naming Conventions

- **Files & Directories:** `kebab-case` (e.g., `class-card.tsx`, `use-classes.ts`, `class.service.ts`).
- **Components:** `PascalCase` (e.g., `ClassCard`, `SidebarNav`, `CreateClassDialog`).
- **Hooks:** `camelCase` prefixed with `use` (e.g., `useClasses`, `useDebounce`).
- **Services & Utils:** `camelCase` (e.g., `classService`, `formatDate`).
- **Types & Interfaces:** `PascalCase` (e.g., `Class`, `CreateClassPayload`, `SidebarState`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `CLIENT_API_URL`, `DEFAULT_PAGE_SIZE`).

### 2.3. Clean Architecture, SRP & Component Extraction

- **Page Line-Count & Responsibility Rule:**
  - The page component (`page.tsx` or `[name]-client.tsx`) acts primarily as an orchestrator (fetching initial data, handling CRUD operations, managing modal toggles, and enforcing RBAC).
  - **Pages under 200 lines (100–200 lines):** May keep simple UI layout inline within the page file.
  - **Pages 200 lines or longer (>= 200 lines):** MUST extract layout sections, modals, and tables into dedicated sub-components in `src/features/{feature}/components/`.
- **Role-Unified Components:**
  - If a section layout is identical between roles (Teacher vs Student) but differs only in action permissions, create ONE single unified component and pass role props (e.g. `isTeacher?: boolean`) from the page. Do NOT duplicate separate Teacher and Student components.
- **Repetitive List Rendering via `.map()`:**
  - Repetitive UI elements (menus, tabs, resource groups, action buttons) MUST NOT be duplicated manually in JSX. Always define a typed configuration array `const items = [...]` and render dynamically using `.map()`.
- **Strict Separation of Concerns:**
  - **No In-Component Types:** Never declare extensive domain interfaces inside `.tsx` components. Put them in `src/types/{feature}.d.ts`.
  - **No In-Component Helpers:** Move all parsers, URL formatters, file-size calculations, and key builders into `src/features/{feature}/utils/`.

### 2.4. Global `cursor-pointer` Standard

- The `cursor-pointer` styling is already baked into `src/components/ui/button.tsx` (via `buttonVariants`) and `src/app/globals.css` (`button:not(:disabled) { cursor: pointer; }`).
- **FORBIDDEN:** Do not manually add `className="cursor-pointer ..."` to `<Button>` components.
- **ALLOWED:** Apply `cursor-pointer` only to non-button interactive elements (e.g. clickable cards, accordion headers, custom filter tabs).

### 2.5. Visual Accent & Contrast Standard (Anti-Pure-White)

- **Avoid Plain All-White:** Interface elements must not appear washed out or flat against a pure white background. Always incorporate visual depth using subtle borders, card background separation, and Galaxy palette accents.
- **Buttons:** Primary buttons should use vibrant accent/gradient fills (`bg-primary`, subtle shadows); secondary buttons should use crisp borders (`border-slate-300 dark:border-slate-700`).
- **Information Cards:** Cards must feature distinct borders (`border border-slate-200/80 dark:border-slate-800/80`), separated background tints, and colored accent indicators (e.g., colored category badges or accent border indicators for resource types).
- **Section Titles:** Section headers should incorporate distinctive visual anchors (e.g., icons enclosed in tinted circular backgrounds such as `bg-blue-100 text-blue-600 dark:bg-blue-950/60`, or accent indicator bars).

---

## 3. ARCHITECTURE & FOLDER STRUCTURE

All frontend source code resides under `src/`. Do not place feature logic directly inside `src/components/` or global folders.

```text
src/
├── app/                         # Next.js App Router (routes, layouts, globals.css)
│   ├── (auth)/                  # Route group: Authentication (login, register)
│   ├── (main)/                  # Route group: General app pages (home, tools, profile)
│   ├── admin/                   # Route: System administrator portal
│   ├── classes/                 # Route: Classroom management and detail views
│   └── globals.css              # Global styles & Tailwind v4 @theme tokens
│
├── components/                  # Global shared UI components
│   ├── ui/                      # shadcn/ui primitives (button, dialog, input...)
│   ├── layout/                  # Shared layouts (navbar, footer, sidebar)
│   ├── providers/               # Global context providers (swr-provider.tsx)
│   ├── shared/                  # Reusable cross-feature widgets (search-bar, pagination)
│   └── resources/               # Shared learning resource primitives
│
├── config/                      # Centralized configuration
│   ├── app.ts                   # Brand, logo, and general app settings
│   ├── env.ts                   # Environment variables and API endpoints
│   ├── {feature}.ts             # Feature-specific config (class.ts, home.ts, role.ts)
│   └── index.ts                 # Pure re-export barrel (ONLY exports, no direct logic)
│
├── features/                    # Feature-driven modular architecture
│   └── {feature_name}/          # Domain folder (classes, assignments, topics, user...)
│       ├── components/          # Feature-specific UI components
│       ├── hooks/               # Feature SWR hooks (use-classes.ts, use-assignments.ts)
│       ├── schemas/             # Zod validation schemas
│       ├── services/            # Isolated API services (server vs client)
│       └── utils/               # Domain-specific helpers and SWR key builders
│
├── hooks/                       # Generic global React hooks (useDebounce, useMediaQuery)
├── lib/                         # Core utilities (client-api-client.ts, server-api-client.ts, utils.ts)
├── locales/                     # Centralized Vietnamese dictionaries for i18n
├── mocks/                       # Standalone temporary mock data (separated from features)
│   └── {domain}/                # Domain mock datasets (classes, assignments, quizzes...)
├── stores/                      # Zustand global client stores (sidebar-store.ts...)
└── types/                       # Shared TypeScript definitions (*.d.ts only, NO index.ts)
├── lib/ # Core utilities (client-api-client.ts, server-api-client.ts, utils.ts)
├── stores/ # Zustand global client stores (sidebar-store.ts...)
└── types/ # Shared TypeScript definitions (\*.d.ts, index.ts)

````

---

## 4. PAGE RENDERING RULES (SSR VS. CLIENT VS. HYBRID)

AI Agents MUST follow these explicit rules when creating or updating pages:

### Rule 1: Hybrid Pattern (Default & Recommended for Data Pages)

For any page that displays dynamic backend data (e.g., Class List, Class Detail, Materials, User Profile):

1. **Server Page (`page.tsx`):**
   - Must be a Server Component (no `'use client'`).
   - Responsible for reading URL searchParams/params, checking initial auth cookies, and fetching initial data on the server via `*.server.service.ts` (using `serverApiClient`).
   - Passes `initialData` as props to the Client View Component.
2. **Client View (`{name}-client.tsx`):**
   - Marked with `'use client'`.
   - Accepts `initialData` and passes it to the corresponding SWR hook as `fallbackData`.
   - Handles all client interactions, modals, active tabs, filters, and mutations via `*.service.ts` (using `clientApiClient`).

```typescript
// Example: src/app/classes/page.tsx (Server Component)
import { classServerService } from '@/features/classes/services/class.server.service';
import { ClassesClient } from './classes-client';

export default async function ClassesPage({ searchParams }: PageProps) {
  const initialClasses = await classServerService.getClasses(searchParams);
  return <ClassesClient initialData={initialClasses} />;
}
````

```typescript
// Example: src/app/classes/classes-client.tsx (Client Component)
'use client';
import { useClasses } from '@/features/classes/hooks/use-classes';

export function ClassesClient({ initialData }: ClassesClientProps) {
  const { classes, isLoading } = useClasses({ initialData });
  return <ClassGrid items={classes} loading={isLoading} />;
}
```

### Rule 2: Pure Server Component (Static / Content Pages)

- For static informational pages, documentation, or legal terms that require no state or event listeners.
- Do not add `'use client'` unless browser interactivity or React hooks (`useState`, `useEffect`) are strictly necessary.

### Rule 3: Pure Client Component (Browser-Only / Interactive Flows)

- Used for complex client-side workflows that depend heavily on browser state, canvas, real-time WebSockets, or client-only camera/media access.
- Always implement appropriate loading skeletons (`Suspense` or loading state) to prevent content layout shifts.

---

## 5. DATA FETCHING & STATE MANAGEMENT

### 5.1. Dual API Clients Architecture (`src/lib/api/`)

To avoid Docker network loopbacks, prevent server action latency, and ensure strict separation of concerns, the client codebase uses two dedicated clients:

1. **Client API Client (`src/lib/api/client-api-client.ts`):**
   - Used exclusively by browser components, hooks, and Client Services (`*.service.ts`).
   - Uses `window.location.origin` or `NEXT_PUBLIC_API_URL` with `credentials: 'include'`.
   - Never accesses Server Actions or Next.js server runtime.

2. **Server API Client (`src/lib/api/server-api-client.ts`):**
   - Used exclusively by Server Components, SSR layouts, and Server Services (`*.server.service.ts`).
   - Resolves internal network addresses (`INTERNAL_API_URL` / `http://server:5000/api/v1` in Docker, `http://localhost:5000/api/v1` locally).
   - Reads auth cookies via `next/headers` and forwards them in HTTP headers.

3. **Response normalization contract:**

   ```typescript
   export interface ApiResponse<T> {
     success: boolean;
     message?: string;
     data: T | null;
     statusCode?: number;
     error?: string;
   }
   ```

### 5.2. Service Layer Standards (`features/{feature}/services/`)

- **Strict Feature Scope:** Each service file MUST strictly handle operations belonging to its domain feature. For example, `assignments.service.ts` only handles assignments; submission operations MUST be located in `submission.service.ts`. Never cross-bundle unrelated methods.
- **Single-Line `//` Comments:** Use only single-line `//` comments in services.
- **YAGNI Principle:** Do not write unused or speculative API methods. Only implement methods required by active user stories.
- **Error Handling & User Feedback:** When an API response indicates failure (`success: false` or `statusCode >= 400`), the service must return structured error details. UI components/hooks must catch these errors and trigger clear Vietnamese toast notifications (`sonner`) or alert dialogs using the backend's `message` or `errorCode`. Never swallow errors via `catch { return []; }`.
- **Mock Fallback Strategy:** If backend endpoints are pending, mock data may be used as a temporary fallback directly in the service. The fallback must be structured with a single-line toggle so that commenting it out (`//`) immediately switches to live backend data:

  ```typescript
  // Return mock fallback during BE development (comment out when live API is ready)
  // return { success: true, data: MOCK_ASSIGNMENTS, message: 'Mock data' };
  const res = await clientApiClient<Assignment[]>(`/assignments/classes/${classId}`);
  return res;
  ```

### 5.3. SWR Custom Hooks (`features/{feature}/hooks/`)

- **Mandatory Hook Encapsulation:** Page and UI components MUST NOT call service methods directly to read data. Every data query MUST be encapsulated in a custom hook (e.g., `useClasses`, `useTopics`, `useAssignments`).
- **Request Deduplication & Cache Sharing:** Using dedicated SWR hooks ensures multiple sibling components consuming the same dataset fire only one network request and share unified cache.
- **Initial Data Hydration:** Always accept `initialData` from Server Components and configure `fallbackData: initialData` with `revalidateOnMount: false` to eliminate layout flicker.

### 5.4. Zustand Stores (`src/stores/`)

- Use Zustand ONLY for genuine client-side global state (e.g., sidebar collapsed state, floating modal toggles, current active tool).
- DO NOT duplicate backend data caching in Zustand; SWR already handles caching, revalidation, and optimistic updates.
- Keep store definitions minimal and typed:

  ```typescript
  interface SidebarStore {
    isCollapsed: boolean;
    toggle: () => void;
  }
  ```

---

## 6. STYLING & GALAXY DESIGN SYSTEM

- **Tailwind CSS v4 Engine:** The project uses `@tailwindcss/postcss`. Configuration is strictly maintained inside `src/app/globals.css` under `@theme inline`.
- **FORBIDDEN:** Do not create `tailwind.config.js` or `tailwind.config.ts`.
- **Design Tokens:**
  - Standard OKLCH colors: `--background`, `--foreground`, `--primary`, `--card`, `--border`, `--ring`.
  - Galaxy/Universe Theme tokens:
    - `--color-galaxy-blue`: `#1e3a8a`
    - `--color-galaxy-purple`: `#581c87`
    - `--color-galaxy-dark`: `#0f172a`
    - `--background-image-galaxy`: `linear-gradient(...)`
    - `--universe-dark`, `--universe-light`, `--universe-accent`
- **Visual Contrast & Aesthetics:** Avoid sterile all-white layouts. Ensure clear visual hierarchy with distinctive borders, accent badge highlights, and smooth hover transitions.
- **Component Preservation:** Re-use shadcn components from `src/components/ui/`. Do not introduce conflicting third-party styling libraries.

---

## 7. FORM VALIDATION & TYPES

- **Validation Schema:** Use Zod schemas located in `features/{feature}/schemas/`.
  - Field names: English.
  - Validation messages: Clear Vietnamese for student/teacher display.
  - Always export the inferred type: `export type CreateClassFormValues = z.infer<typeof createClassSchema>;`
- **TypeScript Declaration Files (`src/types/*.d.ts`):**
  - All shared entity and data contract types MUST be written as `.d.ts` files (e.g., `class.d.ts`, `topic.d.ts`, `user.d.ts`, `api.d.ts`).
  - Types should accurately reflect Prisma models from `ilms-server` and backend Swagger DTO contracts.
  - **Zero Runtime Code in `.d.ts`:** Never place `const`, functions, classes, or valued enums inside `.d.ts`. Use `.ts` exclusively for files exporting runtime objects (such as `enum.ts` or `ClassTabs` in `index.ts`).
  - **Direct Import:** Always import types directly from their respective module: `import type { Topic, Material } from '@/types/topic';`.
  - **FORBIDDEN:** Never re-export `.d.ts` files from `src/types/index.ts` using `export * from './user'`, as Next.js bundler will fail looking for runtime `.js` files.

---

## 8. CLASSROOM WORKSPACE & PAGE DESIGN CONVENTIONS

- **Full-Width Workspace:** All classroom pages (`src/app/classes/[id]/`) must render across the full width (`w-full` with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`), eliminating 2/3 left-biased containers.
- **Hub-and-Spoke Topic Model:**
  - `Topic` serves as the structural spine of the course.
  - Each Topic contains 4 groups of learning resources:
    1. **Bài giảng (Lectures / Materials):** Video YouTube/MP4, Slide PDF.
    2. **Tài liệu tham khảo (References):** Textbooks, external links, exercises.
    3. **Bài tập (Assignments):** Homework, projects with deadlines and grading.
    4. **Trắc nghiệm (Quizzes):** Interactive online/offline quiz assessments.
- **Page Roles:**
  - **Tổng quan (`/overview`):** The Master Syllabus. Shows all topics. When expanded, reveals all 4 resource categories. Topic action: "Thêm tài nguyên".
  - **Tài liệu (`/materials`):** Learning Materials Filter. Shows topics filtering only Lectures + References. Topic action: "Thêm tài liệu".
- **Action Buttons & RBAC:**
  - Every resource item supports: Edit (`Sửa`), Delete (`Xóa`), and View/Download (`Xem/Tải`).
  - Every Topic supports: Edit Topic (`Sửa`), Delete Topic (`Xóa`), and Add Resource (`Thêm tài nguyên` / `Thêm tài liệu`).
  - Mutating actions (Add, Edit, Delete) are strictly gated to Teachers (`isTeacher === true`).
- **Plural URL Standard for Details:**
  - `/classes/[id]/materials/[itemId]`
  - `/classes/[id]/assignments/[itemId]`
  - `/classes/[id]/forums/[postId]`

---

## 9. QUALITY ASSURANCE & VERIFICATION

Automated test runners (Jest/Vitest) are currently not configured in `ilms-client`. Before completing any frontend development or refactoring task, perform:

### 9.1. Automated Three-Step Toolchain Verification

1. **Prettier Format Check:** Run `npm run format` in `ilms-client/` to automatically format all files according to project standards.
2. **TypeScript Strict Typecheck:** Run `npm run typecheck` (`tsc --noEmit`). Must exit with code 0 and zero type errors.
3. **ESLint Verification:** Run `npm run lint` (or `npm run lint:fix`). Must exit with code 0 with zero runtime or syntax warnings.

### 9.2. Manual UI/UX Verification

1. Inspect UI responsiveness across Mobile, Tablet, and Desktop breakpoints.
2. Test Dark Mode and Light Mode rendering.
3. Verify form validation with valid, boundary, and invalid inputs.
4. Verify all 4 mandatory UI states: Loading skeleton, Empty state graphic, Error alert, and Success feedback.
5. Inspect browser Network tab to ensure no duplicate API calls and verified SWR cache reuse.

---

## 10. INTERNATIONALIZATION (i18n) READINESS STANDARD

To prepare for future multi-language capabilities (Vietnamese, English, etc.) without requiring visual rework or template rewrites:

1. **Zero Hardcoded Strings:** AI Agents must NEVER hardcode user-facing strings (labels, button texts, page headings, toast notifications, error messages) directly inside JSX/TSX component tags.
2. **Centralized Dictionaries:** Store all Vietnamese strings inside `src/locales/vi/`:
   - `common.ts`: Global actions, buttons, pagination, navigation, empty states.
   - `auth.ts`: Authentication forms, validation hints, onboarding steps.
   - `classes.ts`: Class management, topics, materials, members.
   - `{feature}.ts`: Specific feature domain dictionaries.
3. **Usage in Components:** Import the dictionary object from `@/locales/vi` (e.g., `import { commonLocales, classesLocales } from '@/locales/vi';`) and reference strings cleanly.
