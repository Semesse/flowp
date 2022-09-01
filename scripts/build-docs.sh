# lazy install this dependency because cloudflare pages automatically install using npm ci
pnpm add -D standard-markdown-documenter --force
pnpm build
pnpm tsc
pnpm build:api
pnpm script ./scripts/build.ts

cd site
pnpm install --frozen-lockfile
pnpm build