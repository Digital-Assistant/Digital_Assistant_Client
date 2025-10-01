# Junie Development Guidelines

This comprehensive guide provides all essential information for developing the Digital Assistant project, including project context, existing and target architectures, testing procedures, and development workflows.

---

## Table of Contents

1. [Project Context & Background](#project-context--background)
2. [Current Architecture (As-Is)](#current-architecture-as-is)
3. [Target Architecture (To-Be)](#target-architecture-to-be)
4. [Project Overview & Intentions](#project-overview--intentions)
5. [GitHub Issue Integration](#github-issue-integration)
6. [Plan Approval Workflow](#plan-approval-workflow)
7. [Build/Configuration Instructions](#buildconfiguration-instructions)
8. [Testing Information](#testing-information)
9. [Development Information](#development-information)
10. [Code Conventions](#code-conventions)

---

## Project Context & Background

### Digital Assistant Project Overview

The Digital Assistant project is undergoing a **major architectural transformation** to create a more flexible, maintainable, and reusable system. This transformation involves decoupling the core business logic from the user interface, enabling customers and developers to build custom UIs while leveraging a powerful, framework-agnostic SDK.

### Current State

The existing codebase is a monolithic React application where business logic, state management, and UI components are tightly coupled. While functional, this architecture limits:

- **Reusability**: Logic cannot be used outside the React ecosystem
- **Testability**: Complex interdependencies make unit testing challenging
- **Customer Flexibility**: Customers must use the provided React UI
- **Maintainability**: Changes can have unexpected cross-layer effects
- **Team Scalability**: UI and core teams cannot work independently

### Transformation Goals

The refactoring aims to:

1. **Extract Core Logic**: Create a pure TypeScript SDK (`@digital-assistant/core`) that contains all business logic
2. **Enable Multi-Framework Support**: Allow React, Vue, Angular, or any JavaScript application to consume the SDK
3. **Improve Testability**: Isolate business logic for comprehensive unit testing
4. **Enhance Customer Flexibility**: Enable completely custom UI implementations
5. **Future-Proof Technology**: Protect core logic from framework dependencies

---

## Current Architecture (As-Is)

### Overview

The existing codebase represents a monolithic React application where business logic, state management, and UI components are tightly coupled through Redux.

**Key Issues:**
- Business logic embedded in Redux Thunks
- Direct DOM manipulation from state management layer
- Framework-dependent core functionality
- Limited reusability and testability

For detailed architectural diagrams, analysis, and flow examples, see [`original-architecture.md`](./original-architecture.md).

---

## Target Architecture (To-Be)

### Overview

The target architecture creates a framework-agnostic `@digital-assistant/core` SDK that completely decouples business logic from UI implementation.

**Key Benefits:**
- Framework-agnostic core SDK
- Clear separation of concerns
- Enhanced reusability and testability
- Customer flexibility for custom UIs
- Future-proof technology stack

**Core Components:**
- **Public API**: Clean facade for UI interactions (`initialize()`, `startRecording()`, `getFlows()`, etc.)
- **Internal Modules**: API Service, DOM Engine, Speech Engine, Feature Manager
- **Event-Driven Communication**: SDK publishes state changes via subscription pattern

For detailed architectural diagrams, component interactions, key flows, and architectural comparisons, see [`modified-architecture.md`](./modified-architecture.md).

---

## Project Overview & Intentions

### Elaboration and Goal

The primary goal of this project is to perform a **major architectural refactoring** by decoupling the "brain" of the application from its "face." We are creating a new, distinct entity: the **@digital-assistant/core SDK**. This SDK will be a pure TypeScript library, completely independent of any UI framework, acting as a self-contained "engine" that handles all application functionality.

### Rationale and Business Value

- **Reusability**: The created SDK can be used to power other applications (Vue, Angular, etc.), drastically reducing future development time.
- **Maintainability**: Creates a clear separation, allowing developers to work on the UI and the core logic independently without risk of cross-contamination.
- **Testability**: A pure TypeScript library is infinitely easier to unit and integration test, leading to a much more robust and reliable system.
- **Clear Ownership**: Allows for clear team ownership between a "platform/core" team and "product/UI" teams.
- **Customer Flexibility**: Customers can build completely bespoke UIs from scratch, tailored to their brand and needs.
- **Future-Proofing**: Core business logic is isolated from framework dependencies, ensuring longevity.

### Architecture Documentation

- **Original Architecture**: Detailed documentation of the current monolithic structure can be found at [`original-architecture.md`](./original-architecture.md)
- **Refactoring Architecture**: Target architecture with decoupled SDK design can be found at [`modified-architecture.md`](./modified-architecture.md)

---

## GitHub Issue Integration

### Objective

Before starting any development task related to a GitHub issue, you must fetch the issue details to understand the requirements, acceptance criteria, and any other relevant context. This ensures full understanding of both specific requirements and broader project alignment.

### Steps

1. **Identify the Issue Number:** The user will provide a GitHub issue number as part of the task prompt (e.g., "Fix bug in #123").

2. **Fetch Issue Details:** Use the `mcp_github_get_issue` tool to retrieve the details of the specified issue from the repository (Digital-Assistant/Digital-Assistant-SDK).

3. **Analyze the Issue:** Review the title, description, labels, and comments of the issue to fully understand the task at hand. Pay close attention to:
    - The problem description
    - Steps to reproduce the issue (if it's a bug)
    - Expected behavior or acceptance criteria
    - Any discussion in the comments that might provide additional context
    - **Epic/Parent Issue References**: Look for links to parent Epics or related issues

4. **Check for Epic Context:** If the issue appears to be a subtask or references a parent Epic, consider fetching the Epic details for broader context:
    - Look for Epic links in the issue description or labels
    - Check if the issue is part of a milestone that has an associated Epic
    - Use `mcp_github_get_issue` to fetch Epic details when broader project context is needed
    - **Balance**: Focus on the specific task while understanding its role in the larger project goal

5. **Contextual Understanding:** Combine the specific task requirements with the project's overall intentions (as documented in this guidelines file) to ensure alignment with the architectural refactoring goals.

6. **Create Development Plan:** Based on the issue analysis and project context, create a detailed development plan that includes all necessary steps to resolve the issue.

7. **Seek Plan Approval:** Present the development plan to the user for approval before proceeding with implementation.

8. **Execute Approved Plan:** Once the plan is approved, proceed with the development task, keeping both the immediate requirements and overall project goals in mind.

### Example Interaction

**User:** "Please implement the feature described in issue #456."

**Junie:**
1. *Fetches issue #456 details using GitHub Issues MCP*
2. *Analyzes the issue and identifies Epic #123 reference*
3. *Fetches Epic #123 for broader context*
4. *Reviews project architecture documentation and guidelines*
5. *Creates comprehensive development plan incorporating:*
    - Specific issue requirements
    - Epic objectives
    - Architectural refactoring goals
    - Testing requirements
    - Documentation updates
6. *Presents plan to user: "Based on my analysis, here's my development plan... Do you approve this approach?"*
7. *Waits for user approval before beginning implementation*
8. *Executes approved plan with regular progress updates*

### Epic Context Guidelines

- **When to fetch Epic details**: If the issue mentions "Epic", "Parent", or has labels like "subtask"
- **What to look for in Epics**: Overall business objectives, acceptance criteria, architectural considerations
- **Balancing focus**: Use Epic context to inform decisions but stay focused on the specific task requirements
- **Project alignment**: Always consider how the task fits within the overall architectural refactoring goals

---

## Plan Approval Workflow

### Mandatory Plan Approval Process

Before executing any development task, you **must** follow this approval workflow:

### 1. Plan Creation Requirements

After analyzing the issue/task and understanding the context, create a comprehensive plan that includes:

- **Task Analysis Summary**: Brief summary of the issue/task requirements
- **Project Context Alignment**: How the task fits within the architectural refactoring goals
- **Technical Approach**: Specific implementation strategy
- **Files/Components to Modify**: List of files that will be changed
- **Testing Strategy**: Unit, integration, or E2E tests that will be added/modified
- **Documentation Updates**: Any documentation that needs updating
- **Risk Assessment**: Potential risks and mitigation strategies
- **Estimated Timeline**: Rough estimate of implementation steps

### 2. Plan Presentation Format

Present your plan using this format:

```
## Development Plan for [Issue/Task Title]

### Task Analysis
[Brief summary of requirements and context]

### Implementation Approach
1. [Step 1 with technical details]
2. [Step 2 with technical details]
3. [Continue for all major steps]

### Files to Modify
- `file1.ts` - [Brief description of changes]
- `file2.tsx` - [Brief description of changes]

### Testing Strategy
- [Type of tests to add/modify]
- [Test scenarios to cover]

### Documentation Updates
- [Files/sections to update]

### Risks & Considerations
- [Any potential issues or considerations]

**Do you approve this development plan? Please confirm before I proceed with implementation.**
```

### 3. User Approval Required

**You must wait for explicit user approval** before proceeding with any implementation. Valid approval responses include:
- "Approved" / "Yes, proceed" / "Go ahead"
- "Approved with modifications: [specific changes]"
- Modified plan approval after user-requested changes

### 4. Plan Modifications

If the user requests changes:
1. **Acknowledge the feedback**: Confirm understanding of requested modifications
2. **Update the plan**: Revise the plan according to user feedback
3. **Re-present for approval**: Present the updated plan and wait for new approval
4. **Only proceed after approval**: Do not begin implementation until approved

### 5. Implementation with Progress Updates

Once approved:
1. **Follow the approved plan**: Implement exactly as approved unless issues arise
2. **Provide regular updates**: Use the standard UPDATE format with progress
3. **Flag deviations**: If you need to deviate from the approved plan, seek additional approval
4. **Complete documentation**: Ensure all planned documentation updates are completed

---

## Build/Configuration Instructions

### Project Structure

```
./
├── packages/core/          # Core SDK (framework-agnostic)
├── src/                   # React UI application
├── docs/                  # Documentation files
├── test/                  # Test files
├── config/                # Configuration files
└── scripts/               # Build and utility scripts
```

### Installation & Setup

```bash
# Install dependencies
npm install

# Build the core SDK
npm run build:core

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

- Copy `.env.example` to `.env` and configure required variables
- Ensure Keycloak configuration is properly set up
- Configure API endpoints and feature flags

---

## Testing Information

### Test Structure

The project follows a comprehensive testing strategy with different levels of testing:

- **Unit Tests**: Located in `test/unit/` - Test individual functions and modules
- **Integration Tests**: Located in `test/integration/` - Test component interactions
- **End-to-End Tests**: Located in `test/e2e/` - Test complete user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Test Configuration

- **Test Runner**: Jest with TypeScript support
- **Test Environment**: jsdom for DOM manipulation testing
- **Coverage Requirements**: Minimum 80% code coverage for core modules
- **Mocking**: Use mocks by using appropriate libraries.

### Adding New Tests

1. **Unit Tests**: Create test files adjacent to source files with `.test.ts` or `.spec.ts` extension
2. **Integration Tests**: Place in `test/integration/` directory
3. **Test Naming**: Use descriptive test names that clearly indicate what is being tested

### Sample Test Example

```typescript
// Example: core/dom-engine.test.ts
describe('DOMEngine', () => {
    it('should capture click events correctly', () => {
        const domEngine = new DOMEngine();
        const mockEvent = new MouseEvent('click');

        const result = domEngine.captureEvent(mockEvent);

        expect(result).toMatchObject({
            type: 'click',
            timestamp: expect.any(Number),
            target: expect.any(Object)
        });
    });
});
```

### Guidelines for Test Development

- **Test First**: Write tests before implementing features when possible
- **Isolation**: Each test should be independent and not rely on other tests
- **Clear Assertions**: Use descriptive assertions that clearly indicate expected behavior
- **Mock External Dependencies**: Mock API calls, DOM interactions, and third-party libraries
- **Edge Cases**: Include tests for error conditions and edge cases

---

## Development Information

### Development Workflow

1. **Issue-Driven Development**: Always start with a GitHub issue (use MCP server integration)
2. **Context Analysis**: Understand both specific requirements and broader architectural goals
3. **Plan Creation**: Create comprehensive development plan
4. **Library & package recommendation**: State clearly if any new packages or libraries are to be installed.
5. **Plan Approval**: Wait for user approval before implementation
6. **Failure Recovery**: If the library or package is not installed correctly wait for the instruction from the user.
7. **Branch Strategy**: Create feature branches from `develop` following naming conventions
8. **Core-First Approach**: Implement business logic in the core SDK first, then add UI components
9. **Testing**: Write tests alongside feature development
10. **Documentation**: Update relevant documentation files
11. **Code Review**: Follow pull request process with proper testing and validation

### Key Development Principles

- **Separation of Concerns**: Keep UI logic separate from business logic
- **Pure Functions**: Prefer pure functions in the core SDK for better testability
- **Event-Driven Architecture**: Use event patterns for communication between layers
- **Immutable State**: Follow Redux patterns for state management
- **Framework Agnostic**: Ensure core SDK has no framework dependencies

### Debugging Guidelines

- **Core SDK Issues**: Test SDK functionality in isolation first
- **UI Issues**: Check if the problem exists in the core SDK or UI layer
- **Performance**: Profile both SDK and UI components separately
- **Browser Compatibility**: Test across different browsers and environments

### Development Tools

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: Strict TypeScript configuration
- **Bundle Analysis**: Webpack Bundle Analyzer for optimization

---

## Code Conventions

Detailed code conventions and standards can be found in [`conventions.md`](./conventions.md).

### Quick Reference

- **Language**: TypeScript with strict mode enabled
- **Naming Conventions**:
    - camelCase → variables, functions
    - PascalCase → classes, React components
    - snake_case → config files
- **Git Commits**: Follow Conventional Commits specification
- **File Structure**: Organized by feature/domain rather than file type
- **Import Organization**: External libraries first, then internal modules

### Quality Gates

- All TypeScript errors must be resolved
- ESLint checks must pass
- Prettier formatting must be applied
- Test coverage must meet minimum requirements
- All tests must pass before merging

---

## Additional Resources

- **Architecture Documentation**: See [`original-architecture.md`](./original-architecture.md) and [`modified-architecture.md`](./modified-architecture.md)
- **Code Conventions**: See [`conventions.md`](./conventions.md)
- **Contributing Guidelines**: See [`contributions.md`](./contributions.md)

---