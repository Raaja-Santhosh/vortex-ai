# Vortex AI - Complete Recreation Prompt

Copy and paste the entire prompt below into any AI coding assistant to perfectly recreate the Vortex AI Agency Operating System.

***

**System Role & Objective**
You are an expert Frontend Engineer and UI/UX Designer. Your task is to build "Vortex AI", a fully functional, highly interactive AI Agency Operating System dashboard using React (TypeScript), Tailwind CSS, and `lucide-react` icons.

**1. Design System & Aesthetic Rules**
- **Theme**: Ultra-high-end, premium minimalist dark mode (inspired by Vercel, Linear, and Midday.ai).
- **Colors**: Strictly monochrome. Backgrounds must be pure black (`#000000` or `#09090B`). Text should be muted white/gray (`#A3A3A3` for secondary, `#FFFFFF` for primary). Use very dark zinc (`#18181B` or `#27272A`) for subtle component backgrounds.
- **Borders & Shadows**: DO NOT use drop shadows. Separate elements using 1px hairline borders (`border-border-subtle`, e.g., `#27272A`). 
- **Typography**: Clean sans-serif for body text, and a distinct monospace font for metrics, numbers, and system logs. No uppercase brutalism.

**2. Architecture & State Management**
- Build a global `DashboardContext.tsx` to handle state (mock data for API requests, latency history, active agents, client lists, Kanban tasks, invoices, and a global toast notification system).
- Implement a `DashboardShell.tsx` which includes:
  - A persistent, minimalist icon-only left sidebar. The top logo must be a geometric Hexagon/Box icon.
  - A top header navigation featuring the title "Vortex AI" on the left, a mock search bar, and a user avatar on the right.
  - Global overlay components for a `ToastContainer`, an `AIChatbot` toggle modal, and a `CommandMenu` (Ctrl+K style search).

**3. Core Pages (Rendered dynamically inside the Shell)**
Ensure every single page meticulously follows the dark-mode minimal design system without exception.

- **FinancialCenter.tsx (Command Center)**: This is the main page. It must contain:
  - A grid of KPI cards tracking: Agent Operations (live ticker of API requests/errors), Model Latency (dynamic bar chart in ms), Compute Cost (GPU hours remaining), API Spend, and Cloud Infrastructure Costs (dynamic line chart).
  - An Action Button Row ("Deploy Agent", "Create API Key", etc.) where every button triggers a global Toast notification.
  - A "Recent System Events" log panel at the bottom displaying timestamped system events.

- **ClientCRM.tsx (Clients)**: An elegant, soft-bordered data grid to manage agency clients, their API usage tier, and MRR. Include a sleek "Add Client" modal.

- **ProjectTasks.tsx (Tasks)**: A smooth Kanban board. Columns must be subtly styled (not bright colors). Task cards should show priority, assignee, and tags in a clean layout.

- **DocumentVault.tsx (Vault)**: A secure-feeling file manager showing uploaded API keys, model weights, and system logs with file type icons.

- **InvoicingBilling.tsx (Invoices)**: A ledger table showing outstanding, paid, and overdue invoices, with a dark-themed "Draft Invoice" modal.

- **TimeTracker.tsx (Time Log)**: A functional session timer displaying ticking seconds in a large mono font, alongside a table of logged historical sessions.

**4. Interactivity & Polish**
- Every button click on the main dashboard must trigger a realistic action via the Toast system (e.g., clicking "Manage instances" pops up "Redirecting to GPU instance manager...").
- Ensure smooth `transition-all` and `animate-in fade-in` on page loads and hover states. Hovering over cards should cause a very subtle transform or background lightening.
- Ensure the live data metrics (like Model Latency charts) use `setInterval` or `useEffect` to visibly fluctuate and simulate live AI infrastructure activity.

***
