pnpm build
pnpm tsc
pnpm build:api
pnpm script ./scripts/build.ts

cd site
pnpm install --frozen-lockfile
pnpm build