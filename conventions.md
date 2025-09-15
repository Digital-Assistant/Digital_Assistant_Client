# Project Conventions

These conventions ensure consistency across the Digital Assistant project.

---

## Code Style
- Language: **TypeScript**
- Strict TypeScript enabled (`strict: true`)
- ESLint + Prettier for linting and formatting
- Naming:
  - camelCase → variables, functions
  - PascalCase → classes, React components
  - snake_case → config files (e.g., `tsconfig.json`)

---

## Git & Branching
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code restructure without feature changes
- `test:` test addition or updates
- `chore:` build or dependency updates

**Branching Strategy:**
- `main` → production-ready
- `develop` → ongoing development
- `feature/*` → new features
- `fix/*` → bug fixes

---

## File Structure
- `packages/core` – Core SDK (framework-agnostic)
- `src/` – React UI application
- `docs/` – markdown documentation

---

## Pull Requests
- Must link to an issue (if applicable)
- PR title should follow commit conventions
- All tests and lint checks must pass before merging
