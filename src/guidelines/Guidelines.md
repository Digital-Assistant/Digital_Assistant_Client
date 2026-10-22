# UDAN-UI Developer Guidelines

## Architecture Overview

UDAN-UI is the new React-based UI layer for the Universal Digital Assistant. It consumes `@udan/digital-assistant-sdk` (UDAN-Core) as its SDK for all business logic, state management, and API calls. The UI is responsible only for rendering and user interaction.

```
Host Application
    └── UDAPluginSDK({ ...config })        ← sets window.UDAGlobalConfig
            └── UDAN-UI (React)
                    └── @udan/digital-assistant-sdk (UDAN-Core)
                            ├── Redux store
                            ├── Services (Search, Record, Auth…)
                            └── Playback engine
```

---

## Configuration Flow

Configuration is passed from the host application via `UDAPluginSDK()`, which calls `AppConfig()` in UDAN-Core. This mutates the `CustomConfig` object in-place, which is the same object reference exposed as `window.UDAGlobalConfig`.

Inside the UI, `window.UDAGlobalConfig` is passed as the `config` prop at the top level (`HomePageUser`) and threaded down to child components:

```
HomePageUser
  config={window.UDAGlobalConfig}
    └── RecordingScreen  config={config}
          └── StepForm   config={config}
```

**Always read feature flags via the `config` prop, never directly from `window.UDAGlobalConfig` inside components.**

```tsx
// ✅ correct
{config.enableAISearch && <AIInputSection />}

// ❌ incorrect
{window.UDAGlobalConfig?.enableAISearch && <AIInputSection />}
```

---

## Component Responsibilities

### `HomePageUser`
Top-level orchestrator. Manages recording state machine (`idle → start → countdown → recording`). Passes `window.UDAGlobalConfig` as `config` to `RecordingScreen`.

### `RecordingScreen`
Manages the three recording phases: `recording → naming → saving`. Delegates all data persistence to UDAN-Core. Renders `StepForm` for the active step and `FinalSaveScreen` for the naming phase.

### `StepForm`
Unified step editor used in both `recording` and `editing` modes. Handles per-step metadata:

| Field | Meta key | Config flag |
|---|---|---|
| Step name | `meta.displayText` | always shown |
| Skip during play | `meta.skipDuringPlay` | `config.enableSkipDuringPlay` |
| Personal information | `meta.isPersonal` | always shown |
| Node type | `meta.selectedElement` | `config.enableNodeTypeSelection` |
| Custom tooltip | `meta.tooltipInfo` | `config.enableTooltipAddition` |
| Playback delay | `meta.slowPlaybackTime` | `config.enableSlowReplay` |
| AI input label | `meta.inputType` | `config.enableAISearch` |
| AI input description | `meta.inputTypeDescription` | `config.enableAISearch` |

### `SearchResults`
Renders the recording list with infinite scroll. Calls `fetchSearchResults` from UDAN-Core directly — no additional params needed as the core reads `UDAGlobalConfig.enableAISearch` and `UDAGlobalConfig.enablePermissions` internally to route to the correct endpoint.

### `FinalSaveScreen`
Handles sequence naming, alias labels, permissions, slow replay toggle, and final submission.

---

## AI Search (`enableAISearch`)

When `enableAISearch` is `true`:

**Search routing (UDAN-Core `SearchService`)** — automatically switches to AI endpoints:
- No permissions → `llmUrl + /search/all?...`
- With permissions → `tokenUrl + /search/all?...`

**Playback (UDAN-Core `matchAction` → `matchLLMInputToNode`)** — uses `meta.inputType` recorded on each step to match the LLM-provided `InputValue` at runtime.

**Recording (UDAN-UI `StepForm`)** — when `config.enableAISearch` is `true`, two additional fields appear in the step editor:
- **Input label** (`meta.inputType`) — the semantic name of the field (e.g. `"First Name"`). The LLM matches this against `inputValues[].Input` at playback time.
- **Input description** (`meta.inputTypeDescription`) — human-readable context for the LLM (e.g. `"Enter the user's first name"`).

Both fields are saved via `updateCustomMetadataService` from `@udan/digital-assistant-sdk`.

---

## Adding a New Config Flag

1. Add the flag to `CustomConfigPropTypes` and `CustomConfig` in `UDAN-Core/src/config/CustomConfig.ts`
2. Gate the feature in `StepForm` (or relevant component) using `config.<flagName>`
3. Update the flag table in this document

---

## Core SDK Interaction Patterns

### Reading global config in core services
```ts
const globalConfig = typeof window !== 'undefined'
    ? (window as any).UDAGlobalConfig
    : (global as any).UDAGlobalConfig;
```

### Updating step metadata
```ts
import { updateCustomMetadataService } from '@udan/digital-assistant-sdk';

const updated = updateCustomMetadataService(recordData, stepIndex, 'myKey', value);
storeRecording(updated);
```

### Dispatching to Redux store
```ts
import { coreSDK } from '../services/coreSDK';
import { startValidation } from '@udan/digital-assistant-sdk';

coreSDK.dispatch(startValidation());
```

### Syncing draft changes (editing mode only)
```ts
import { updateDraftChanges } from '@udan/digital-assistant-sdk';

coreSDK.dispatch(updateDraftChanges(draftStep));
```

---

## State Sync Pattern in `StepForm`

`StepForm` uses two `useEffect` hooks to keep local state and the Redux draft in sync:

1. **FROM `currentStep`** — `useEffect([stepIndex, currentStep?.id])`: reads `objectdata.meta` into local state. Uses `isInternalChange` ref to prevent the second effect from firing back.
2. **TO Redux draft** — `useEffect([...all local state])`: builds and dispatches `updateDraftChanges`. Only runs in `editing` mode and when `isInternalChange.current` is `false`.

When adding a new metadata field to `StepForm`, always update both effects and add the new state variable to the dependency array of effect 2.
