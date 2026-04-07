# Copilot Workspace Instructions

This repository is a React + Vite canvas application built with JavaScript / JSX.

## What this project is
- Single-page React app using Vite (`vite` + `@vitejs/plugin-react`).
- UI relies on Material UI (`@mui/material`, `@mui/icons-material`) and Fabric.js (`fabric`).
- App structure is centered in `src/App.jsx` with interactive canvas logic in `src/components/CanvasBoard.jsx`.
- There is no TypeScript in this workspace; use JavaScript and JSX only.

## Key files
- `package.json` — scripts and dependencies.
- `vite.config.js` — Vite configuration.
- `eslint.config.js` — linting rules for JS/JSX, React hooks, and Vite.
- `src/App.jsx` — main app state, theme, keyboard shortcuts, and layout.
- `src/components/CanvasBoard.jsx` — canvas rendering and tools.
- `src/components/Sidebar.jsx` — action controls and tool selection.
- `src/components/ContextPanel.jsx` — tool-specific settings panel.
- `src/main.jsx` — React app bootstrap.
- `README.md` — general project description and recommended conventions.

## Recommended workflow
- Install dependencies: `npm install`
- Start development: `npm run dev`
- Build production: `npm run build`
- Preview build: `npm run preview`
- Lint source: `npm run lint`

## Code guidance for Copilot
- Prefer existing app conventions over introducing new architecture.
- Keep new features in the React component model and preserve current state flow.
- Use `useState`, `useEffect`, and props drilling in a way consistent with the current codebase.
- Avoid adding TypeScript, new front-end frameworks, or non-native React patterns.
- Keep UI updates aligned with the existing Material UI styling and layout.

## When editing or extending
- Preserve keyboard shortcuts, localStorage user state, and canvas tool interactions.
- Keep the file structure small and focused; add new components only when the new behavior is substantial.
- Use `eslint` configured in `eslint.config.js` as the source of truth for code quality.

## Helpful context
- This app stores user profile data in `localStorage` under `oyun_uygulama_user`.
- The app uses a central theme in `src/App.jsx` and renders the canvas alongside sidebar/context panels.
- The project is a minimal Vite React app; avoid suggestions that require major build-system changes.
