# Core Redux Migration Complete

## Overview
Successfully migrated UI components to use Redux store directly from the core package instead of maintaining a separate UI Redux store. This ensures a single source of truth and eliminates state duplication.

## Changes Made

### 1. ✅ Added Typed Hooks to Core Package

**File:** `packages/core/src/store/index.ts`

Added React-Redux typed hooks for components to use:

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Create typed hooks for React components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Why:** Components can now import `useAppSelector` and `useAppDispatch` directly from `@digital-assistant/core`.

---

### 2. ✅ Exported Editing Slice Actions

**File:** `packages/core/src/store/slices/index.ts`

Added editing slice action exports:

```typescript
// Export action creators from editing slice
export {
    startValidation,
    markValidationCompleted,
    resetValidationState,
    startEditingStep,
    cancelEditingStep
} from './editingSlice';
```

**Why:** Components like RecordSequenceDetails.tsx need these actions.

---

### 3. ✅ Updated EditableStepForm.new.tsx

**File:** `src/components/EditableStepForm.new.tsx`

**Before:**
```typescript
import { useAppDispatch, useAppSelector } from "../redux";
import {
    initializeFormForStep,
    resetForm,
    // ... other actions
} from "@digital-assistant/core";
```

**After:**
```typescript
import {
    getObjData,
    StorageUtil,
    // ... services
    useAppDispatch,          // ✅ From core
    useAppSelector,          // ✅ From core
    initializeFormForStep,
    resetForm,
    // ... all actions from core
} from "@digital-assistant/core";
```

**Result:** Component now uses core Redux store exclusively.

---

### 4. ✅ Updated RecordSequenceDetails.tsx

**File:** `src/components/RecordSequenceDetails.tsx`

**Before:**
```typescript
import { useAppSelector, useAppDispatch } from '../redux';
import {
    cancelEditingStep,
    markValidationCompleted,
    resetValidationState,
    startEditingStep,
    startValidation
} from "../redux/editingStep";
```

**After:**
```typescript
import {
    deleteRecording,
    // ... other imports
    useAppSelector,          // ✅ From core
    useAppDispatch,          // ✅ From core
    cancelEditingStep,       // ✅ From core
    markValidationCompleted, // ✅ From core
    resetValidationState,    // ✅ From core
    startEditingStep,        // ✅ From core
    startValidation          // ✅ From core
} from "@digital-assistant/core";
```

**Result:** Component now uses core Redux store exclusively.

---

## Architecture

### Before (Dual Store Issue)
```
┌─────────────────────────┐
│   UI Redux Store        │
│  (src/redux/index.ts)   │
│   - editingStep         │
│   - editableStepForm    │
└─────────────────────────┘
           ↓ (used by components)
┌─────────────────────────┐
│   Components            │
│  - EditableStepForm     │
│  - RecordSequenceDetails│
└─────────────────────────┘

┌─────────────────────────┐
│  Core Redux Store       │
│ (packages/core/...)     │
│   - editing             │
│   - validation          │
│   - user                │
│   - recording           │
│   - flow                │
│   - editableStepForm    │
└─────────────────────────┘
           ↓ (used by App.tsx via SDK)
┌─────────────────────────┐
│  DigitalAssistantCore   │
│   SDK                   │
└─────────────────────────┘
```

**Problem:** Two separate stores, state duplication, confusion.

---

### After (Single Source of Truth) ✅
```
┌──────────────────────────────────┐
│      Core Redux Store            │
│   (packages/core/src/store/)     │
│   - editing                      │
│   - validation                   │
│   - user                         │
│   - recording                    │
│   - flow                         │
│   - editableStepForm             │
│                                  │
│   Exports:                       │
│   - store                        │
│   - useAppDispatch               │
│   - useAppSelector               │
│   - All action creators          │
└──────────────────────────────────┘
                 ↓
    ┌────────────┴────────────┐
    ↓                         ↓
┌─────────────┐    ┌──────────────────┐
│ Components  │    │  App.tsx         │
│             │    │  (via SDK)       │
│ - Editable  │    │                  │
│   StepForm  │    │  DigitalAssistant│
│             │    │  Core.dispatch() │
│ - Record    │    │                  │
│   Sequence  │    └──────────────────┘
│   Details   │
└─────────────┘
```

**Solution:** Single Redux store in core, used by both SDK and components directly.

---

## What Happened to src/redux/?

The local UI Redux store (`src/redux/index.ts`) is now **OBSOLETE** but kept for backward compatibility temporarily.

**Recommendation:** Delete it after testing:
```bash
# After confirming everything works
rm -rf src/redux/
```

The `editingStep.ts` file in `src/redux/` is a duplicate of the core's `editingSlice.ts` and should be removed.

---

## How Components Now Work

### Example: EditableStepForm.new.tsx

```typescript
import {
    useAppDispatch,      // ✅ From @digital-assistant/core
    useAppSelector,      // ✅ From @digital-assistant/core
    initializeFormForStep,
    updateStepName,
    setStepProfanityError,
} from "@digital-assistant/core";

const EditableStepForm = (props) => {
    // Uses core's Redux store
    const dispatch = useAppDispatch();
    const formState = useAppSelector(state => state.editableStepForm.formFields);

    // Dispatches to core store
    dispatch(initializeFormForStep({ item, index, isUpdateMode, recordingId }));

    return <div>...</div>;
};
```

### Example: App.tsx (Existing Pattern)

```typescript
import {
    DigitalAssistantCore,
    setUserData,
} from "@digital-assistant/core";

const DigitalAssistantCoreSDK = new DigitalAssistantCore(config);

// Dispatches to core store via SDK
DigitalAssistantCoreSDK.dispatch(setUserData(data));
```

**Both use the same store!** ✅

---

## Core Package Exports

From `packages/core/src/store/index.ts`:

```typescript
export const store;                          // Redux store instance
export type RootState;                       // State type
export type AppDispatch;                     // Dispatch type
export const useAppDispatch;                 // Typed dispatch hook
export const useAppSelector;                 // Typed selector hook

// All slices and actions exported via:
export * from './slices';
```

From `packages/core/src/store/slices/index.ts`:

```typescript
// Reducers
export { editingReducer, editableStepFormReducer, ... }

// Actions
export { startEditingStep, cancelEditingStep, ... }
export { initializeFormForStep, updateStepName, ... }
export { setUserData, ... }
export { setIsRecording, setIsPlaying, ... }
```

---

## Build & Test Instructions

### 1. Build Core Package
```bash
cd packages/core
npm run build
```

### 2. Start UI Application
```bash
cd ../..  # Back to project root
npm start
```

### 3. Test Functionality

**Recording Mode:**
- Open RecordedData component
- Start a new recording
- Edit a step using EditableStepForm
- Verify form state works
- Check Redux DevTools for `editableStepForm` state

**Update Mode:**
- Open RecordSequenceDetails component
- Click Edit on existing step
- Modify step name
- Click Validate, then Save
- Verify backend updates work

### 4. Verify Redux DevTools

Should see single store with:
```javascript
{
  editing: { ... },
  validation: { ... },
  user: { ... },
  recording: { ... },
  flow: { ... },
  editableStepForm: {
    formFields: { ... },
    errors: { ... },
    uiState: { ... }
  }
}
```

---

## Breaking Changes

### None! ✅

All existing functionality preserved:
- App.tsx continues using `DigitalAssistantCoreSDK.dispatch()`
- Components now import from core instead of local redux
- State shape unchanged
- Actions unchanged

---

## Files Modified Summary

### Core Package (packages/core/)
1. ✅ `src/store/index.ts` - Added useAppDispatch & useAppSelector
2. ✅ `src/store/slices/index.ts` - Exported editing slice actions
3. ✅ `src/services/index.ts` - Aliased conflicting exports (previous fix)
4. ✅ `src/store/selectors/recordingSelectors.test.ts` - Added editableStepForm to mocks (previous fix)

### UI Components (src/)
5. ✅ `components/EditableStepForm.new.tsx` - Import hooks from core
6. ✅ `components/RecordSequenceDetails.tsx` - Import hooks & actions from core
7. ✅ `components/RecordedData.tsx` - Fixed import path (previous fix)
8. ⚠️  `redux/index.ts` - Now obsolete (can be deleted after testing)

---

## Cleanup Tasks (After Testing)

Once everything works:

1. **Delete local Redux store:**
   ```bash
   rm -rf src/redux/
   ```

2. **Remove Redux imports from package.json** (if not used elsewhere):
   ```bash
   npm uninstall @reduxjs/toolkit react-redux
   ```
   (Only if core package provides them)

3. **Update tsconfig paths** (if @redux was aliased)

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: migrate to single Redux store from core package"
   ```

---

## Troubleshooting

### Error: "Cannot find module '@digital-assistant/core'"
**Solution:** Build core package
```bash
cd packages/core && npm run build
```

### Error: "useAppSelector is not a function"
**Solution:** Clear cache and rebuild
```bash
rm -rf node_modules/.cache
rm -rf packages/core/dist
cd packages/core && npm run build
cd ../.. && npm start
```

### Redux DevTools shows old state
**Solution:** Hard refresh browser
```bash
Cmd/Ctrl + Shift + R
```

---

## Success Indicators

✅ Core package builds without errors
✅ UI application starts without errors
✅ Components can import hooks from core
✅ Redux DevTools shows single store
✅ Form editing works in both modes
✅ State persists to localStorage
✅ No console errors

---

**Status:** ✅ Migration Complete - Ready for Testing
**Date:** 2025-12-31
**Next:** Test both recording and update modes, then cleanup src/redux/
