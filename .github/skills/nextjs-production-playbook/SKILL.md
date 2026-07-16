---
name: nextjs-production-playbook
description: "Production-grade TypeScript + Next.js App Router + React 19 implementation guide. Use when building or refactoring Next.js features, auth flows, server actions, route handlers, forms, data fetching, caching, performance, security, accessibility, testing, and deployment readiness."
---

# Next.js + React 19 Production-Grade Instructions

You are an expert in TypeScript, Next.js (App Router), and production React.
Write maintainable, performant, secure, and accessible code that follows modern framework guidance.

## TypeScript Best Practices

- Enable "strict": true in tsconfig.json.
- Prefer type inference, but annotate public APIs (exports, route handlers, server actions).
- Never use any. Use unknown with type guards or schema validation (Zod, Valibot).
- Explicitly model server/client boundaries with typed inputs/outputs.
- Use discriminated unions instead of enums.
- Avoid ambient types and globals.
- Co-locate types with features.
- Enable safety flags:
  - noUncheckedIndexedAccess
  - noPropertyAccessFromIndexSignature
  - exactOptionalPropertyTypes

## React and Next.js Fundamentals

- Default to Server Components.
- Use "use client" only for browser interactivity.
- Prefer Server Actions for mutations and form handling.
- Use Route Handlers only for public APIs, webhooks, or cross-app consumption.
- Target React 19 (stable) with Next.js 15+.
- Use App Router with filesystem conventions (app/, layout.tsx, route groups).
- Avoid Pages Router for new projects.

## Architecture and Project Structure

- Organize by feature (vertical slices), not technology.
- Each feature folder includes its components, server actions, tests, and styles.
- Follow Clean Architecture:
  - Domain: pure business logic
  - Application: use cases and services
  - Infrastructure: DB, APIs, external adapters
- Keep boundaries explicit:
  - server/: server-only utilities
  - components/: shared UI primitives
  - lib/: pure, shared domain logic
- For large projects, use a Turborepo monorepo with shared packages.
- Co-locate tests and stories with features.

## Data Fetching, Caching, and Revalidation

- Fetch in Server Components by default.
- Use built-in Next.js caching:
  - Static content: export const revalidate = <seconds>
  - Dynamic/private: fetch(url, { cache: "no-store" })
- Use ISR or revalidate for periodic updates.
- Prefer on-demand revalidation for CMS integrations.
- For mutations:
  - Use Server Actions with optimistic UI (useOptimistic, Transitions).
  - Invalidate relevant paths instead of managing client caches manually.

## Components and State Management

- Keep components small and focused.
- Put logic in pure functions or server utilities.
- Default to Server Components.
- Use Client Components only when required (event handlers, effects, browser APIs).
- Prefer React built-ins:
  - useTransition
  - useOptimistic
  - useActionState
- Avoid extra client state libraries unless truly needed.
- Keep derived data derived. Avoid duplicate state.
- When rendering lists with .map, evaluate extracting mapped fragments into dedicated components for readability, reuse, and testability.

## Routing and Navigation

- Use nested layout.tsx for shared UI or data boundaries.
- Use route groups () for organization without changing URLs.
- Use Link prefetch defaults. Do not override unless needed.
- Avoid manual routers.

## Performance

- Minimize JavaScript shipped to the browser.
- Prefer server rendering.
- Use Server Components + loading.tsx for streaming and improved TTFB.
- Use next/image for all images:
  - Always include alt, sizes, width/height (or fill).
  - Define remote patterns or loaders for external sources.
- Use next/font for automatic optimization.
- Avoid manual link tags for fonts.
- Avoid client-only fetching if server fetching is possible.
- Run Lighthouse regularly and fix hydration warnings immediately.

## Security

- Enforce strict CSP.
- Generate nonces in middleware for inline scripts.
- Avoid "unsafe-inline".
- Centralize headers:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Content-Type-Options
  - Referrer-Policy
- Never expose secrets to the client.
- Use process.env only in server code.
- Only NEXT_PUBLIC_ vars are allowed in client code.
- Sanitize all inputs and outputs.
- Validate with Zod or Valibot.
- Avoid dangerouslySetInnerHTML unless sanitized and unavoidable.
- Use httpOnly cookies for session/auth tokens.
- Defend against CSRF and XSS.
- Follow Next.js Data Security and middleware guidance.

## Assets: Images, Fonts, Scripts

- Always use next/image:
  - Include alt and known dimensions or fill.
  - Configure remotePatterns for external sources.
- Use next/font for local and Google fonts.
- Use Script strategy="lazyOnload" for third-party scripts.

## Accessibility

- Use semantic HTML and ARIA correctly.
- Ensure all interactive elements are keyboard accessible.
- Keep visible focus outlines.
- Test with axe, Lighthouse, and manual keyboard navigation.

## Testing and Quality

- Unit and integration: Vitest/Jest + React Testing Library.
- E2E: Playwright.
- Test critical paths (auth, routing, server actions, errors).
- Enforce linting (eslint-config-next), Prettier, and type-checking in CI.

## Observability

- Use structured logging on the server.
- Capture Web Vitals (onCLS, onFID, onLCP).
- Integrate error tracking (for example, Sentry).
- Track cache hit/miss rates and revalidation triggers.

## CI/CD and Deployment

- Run next build with strict type checking in CI.
- Run tests before deploy.
- Monitor bundle-size budgets and fail builds when exceeded.
- For Vercel:
  - Use ISR and Data Cache effectively.
  - Deploy edge functions for latency-critical reads.

## Route Handlers vs Server Actions

| Use Case                                | Recommendation |
| --------------------------------------- | -------------- |
| In-app form handling                    | Server Actions |
| Mutations + optimistic updates          | Server Actions |
| Public APIs / webhooks / mobile clients | Route Handlers |
| Cross-app data sharing                  | Route Handlers |

## Production Checklist

- [ ] No hydration warnings.
- [ ] All images via next/image with correct sizes.
- [ ] Fonts use next/font.
- [ ] Revalidation/caching explicitly defined.
- [ ] CSP + headers configured.
- [ ] No secrets in client code.
- [ ] Lighthouse scores green (Perf, A11y, SEO).
- [ ] Web Vitals logged.

## Code Style Rules

- Prefer Server Components by default.
- Use "use client" only when necessary.
- Co-locate Server Actions with components that use them.
- Never access process.env in client code.
- For fetching:

```ts
// Static
export const revalidate = 3600;
const data = await fetch(url, { next: { revalidate: 3600 } }).then((r) => r.json());

// Dynamic
const data = await fetch(url, { cache: "no-store" }).then((r) => r.json());
```
