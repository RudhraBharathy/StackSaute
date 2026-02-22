<h1 align="center">StackSauté</h1>

<p align="center">
  <strong>A local-first developer tool for scaffolding production-grade React & Next.js stacks — with a beautiful web UI.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/stack-saute">
    <img src="https://img.shields.io/npm/v/stack-saute?color=blue&label=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/stack-saute">
    <img src="https://img.shields.io/npm/dm/stack-saute?color=green" alt="npm downloads" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen" alt="Node.js >= 20" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
</p>

---

## What is StackSauté?

StackSauté lets you spin up a new React or Next.js project without memorising CLI flags or copying boilerplate. Just run one command and a local web UI pops open — pick your framework, template, package manager and extra ingredients (Zustand, Tailwind, Supabase, etc.) — then watch your stack scaffold in real time.

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js     | **≥ 20** |
| npm / pnpm / yarn | any |

---

## Quick Start

```bash
# Run directly without installing (recommended)
npx stack-saute

# Or install globally
npm install -g stack-saute
stack-saute
```

> Navigate to **an empty folder first**, then run the command. StackSauté scaffolds the project in the current working directory.

---

## How It Works

1. **Run `npx stack-saute`** in an empty directory.
2. A local Express + Socket.io server starts and opens a **web UI** in your browser.
3. Walk through the guided steps: choose your foundation, template, package manager, and extra packages.
4. Click **Cook** and watch live logs as your project is scaffolded and dependencies are installed.
5. Press **`q`** or **`Ctrl+C`** in the terminal to stop the server when done.

---

## Supported Frameworks

### ⚡ Vite

| Template | Description |
|----------|-------------|
| `react` | React + JavaScript |
| `react-ts` | React + TypeScript |
| `vue` | Vue 3 + JavaScript |
| `vue-ts` | Vue 3 + TypeScript |

### 🔺 Next.js

Configurable options:

- TypeScript / JavaScript
- ESLint on/off
- Tailwind CSS on/off
- `src/` directory structure
- App Router (default)
- `@/*` import alias

---

## Package Managers

Choose from **npm**, **pnpm**, or **yarn**. StackSauté auto-installs the package manager if it isn't already available on your system.

---

## Extra Ingredients (Packages)

Select additional packages during setup. StackSauté automatically resolves modern package names for you:

| Ingredient | Installed Package(s) |
|------------|----------------------|
| `supabase` | `@supabase/supabase-js` |
| `firebase` | `firebase` |
| `clerk` | `@clerk/clerk-react` |
| `zustand` | `zustand` |
| `redux` | `@reduxjs/toolkit`, `react-redux` |
| `tanstack` | `@tanstack/react-query` |
| `tailwindcss` | `tailwindcss` (+ `@tailwindcss/vite` for Vite projects) |
| `sass` | `sass` |
| `styled-components` | `styled-components` |

> **Tailwind + Vite** is handled automatically using the official `@tailwindcss/vite` plugin.

---

## Architecture

```
stack-saute/
├── bin/
│   └── cli.ts          # Entry point — spins up the server & opens the browser
├── src/
│   ├── server.ts       # Express + Socket.io server (serves UI + API)
│   └── server/
│       ├── routes/
│       │   └── cook.ts         # POST /cook — orchestrates scaffold + install
│       └── utils/
│           ├── scaffold.ts     # Vite & Next.js scaffolding logic
│           ├── packageManager.ts  # Ensures pm is installed
│           ├── packageMapping.ts  # Maps friendly names → npm packages
│           ├── process.ts      # Child process runner with live logging
│           ├── directory.ts    # CWD validation & cleanup
│           └── logger.ts       # Socket.io-powered live log emitter
└── src/app/            # React frontend (Vite-built)
```

**Communication flow:** Browser → `POST /cook` → server orchestrates scaffold → Socket.io pushes real-time logs back to the browser → `cooking_complete` event signals success or failure.