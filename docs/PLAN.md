# Orchestration Plan: Nav & Footer Security Hardening

## Background
The user requested via `@[/orchestrate]` to remove the "Admin Login" links from the public-facing navigation structures (Navbar and Footer). Obscuring the login page provides a base layer against casual discovery by unauthorized users, requiring administrators to memorize the hard URL (`/login`) to authenticate.

## Goals
- Remove the `/login` links from the public UI.
- Do not affect the core `/login` or `/admin/*` routes or their route-level protections.

## Affected Components
1. `src/components/layout/Navbar.tsx`
2. `src/components/layout/Footer.tsx`

## Phase 2 Orchestration Strategy
Because the task involves UI removal and security awareness, the following Agents will be orchestrated in Phase 2:
- **frontend-specialist**: Will modify the UI components to cleanly remove the buttons without breaking grid or flex alignments in the `Navbar` and `Footer`.
- **security-auditor**: Will ensure that removing the links maintains the integrity of the underlying `middleware.ts` protections and does not leave orphaned files.
- **test-engineer**: Will verify that standard public navigation still works without triggering 404s, and that the `/login` hard URL is still accessible but unlinked.

## Execution Requirements
Following user approval, the agents will execute the line removals and verify the site structure using the integrated playwright tests.
