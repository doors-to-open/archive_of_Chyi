# Development Notes

## Commands

```sh
npm install
npm run dev
npm run check
npm run build
```

## Local Server

The `dev` and `preview` scripts bind to `127.0.0.1`. This keeps the development server local to the machine while the project is early and while upstream tooling advisories around dev-server exposure remain unresolved.

## Generated Files

These paths are intentionally ignored:

- `.astro/`
- `dist/`
- `node_modules/`
- `.codex-notes/`
- `task_*.md`

## Dependency Audit

`npm audit` currently reports advisories in the Astro/Vite/esbuild toolchain. Do not run `npm audit fix --force` blindly, because npm suggests breaking dependency changes. Recheck after upstream Astro/Vite/esbuild releases update the affected ranges.

