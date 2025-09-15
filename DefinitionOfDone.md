## 1. Purpose

This document defines the universal criteria that must be met for any User Story, Task, or unit of work to be considered "Done." It is our team's shared commitment to quality, consistency, and professionalism.

A story is only truly complete when it meets its unique **Acceptance Criteria** (which define the feature) *and* every item on this **Definition of Done** checklist (which defines our quality standard).

## 2. The Universal Checklist

### Code & Conventions
-   [ ] **Code Implemented:** The code required to satisfy the Acceptance Criteria has been written and committed to its designated feature branch.
-   [ ] **Adheres to Conventions:** The code strictly adheres to all guidelines outlined in `conventions.md`, including naming, formatting (Prettier), and linting (ESLint) rules.
-   [ ] **API Documentation:** All new or modified public-facing APIs, types, and interfaces are clearly documented using TSDoc comments.

### Testing & Quality
-   [ ] **Unit Tests Written:** Comprehensive unit tests have been written for all new logic using the Jest framework.
-   [ ] **Test Coverage Met:** The new logic meets or exceeds the project's 90% code coverage requirement.
-   [ ] **All Tests Pass:** All existing and new unit tests pass when run locally (`npm run test`).
-   [ ] **CI Pipeline Green:** The Continuous Integration (CI) pipeline for the associated Pull Request is green, confirming that all automated checks (linting, testing, building) have passed.

### Process & Review
-   [ ] **Peer Reviewed:** The code has been reviewed and approved by at least one other developer on the team.
-   [ ] **Feedback Addressed:** All comments and requested changes from the code review have been fully addressed.
-   [ ] **Manually Verified (If Applicable):** The functionality has been manually smoke-tested by the author to ensure it works end-to-end and meets the spirit of the requirements.
-   [ ] **Merged:** The approved Pull Request has been successfully and cleanly merged into the `main` branch.

---

Only when every single one of these conditions is met can a task be moved to the "Done" column in our project management tool.