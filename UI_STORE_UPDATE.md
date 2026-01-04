# UI Redux Store Update Guide

After the core package builds successfully, you need to update your UI application's Redux store to include the new `editableStepForm` reducer.

## File to Update

**File:** `src/redux/index.ts`

## Current State (Before)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import reducers
import editingReducer from "./editingStep";

// Create the store
export const store = configureStore({
    reducer: {
        editingStep: editingReducer
    },
});

// Define state type manually without using getState
export interface RootState {
    editingStep: ReturnType<typeof editingReducer>;
}

export type AppDispatch = typeof store.dispatch;

// Create typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Updated State (After)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import reducers from core package
import { editableStepFormReducer } from '@digital-assistant/core';

// Import local reducers
import editingReducer from "./editingStep";

// Create the store
export const store = configureStore({
    reducer: {
        editingStep: editingReducer,
        editableStepForm: editableStepFormReducer, // ✅ ADDED
    },
});

// Define state type manually without using getState
export interface RootState {
    editingStep: ReturnType<typeof editingReducer>;
    editableStepForm: ReturnType<typeof editableStepFormReducer>; // ✅ ADDED
}

export type AppDispatch = typeof store.dispatch;

// Create typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Step-by-Step Instructions

### Step 1: Add Import
Add this line after the existing imports:
```typescript
import { editableStepFormReducer } from '@digital-assistant/core';
```

### Step 2: Add Reducer to Store
Add this line in the `reducer` object:
```typescript
editableStepForm: editableStepFormReducer,
```

### Step 3: Add Type to RootState
Add this line in the `RootState` interface:
```typescript
editableStepForm: ReturnType<typeof editableStepFormReducer>;
```

## Changes Summary

| Change | Line | Description |
|--------|------|-------------|
| Import | ~6 | Import editableStepFormReducer from core |
| Reducer | ~12 | Add to store configuration |
| Type | ~19 | Add to RootState interface |

## Verification

After making these changes, the component should be able to access the state:

```typescript
// In EditableStepForm.new.tsx, this should work:
const formState = useAppSelector(state => state.editableStepForm.formFields);
const errors = useAppSelector(state => state.editableStepForm.errors);
const uiState = useAppSelector(state => state.editableStepForm.uiState);
```

## Testing

1. **Build core package:**
   ```bash
   cd packages/core
   npm run build
   ```

2. **Update src/redux/index.ts** (follow instructions above)

3. **Start your UI application:**
   ```bash
   cd ../..  # Back to project root
   npm start
   ```

4. **Check for errors:**
   - Open browser console
   - Look for Redux state in DevTools
   - Verify `editableStepForm` slice exists

## Redux DevTools

After the update, you should see this structure in Redux DevTools:

```javascript
{
  editingStep: {
    recordingId: null,
    editingStepId: null,
    validationRequired: false,
    validationCompleted: false,
    editingStepOriginalData: null
  },
  editableStepForm: {
    formFields: {
      stepEditValue: "",
      tooltip: "",
      slowPlaybackTime: "",
      customMetadata: {}
    },
    errors: {
      stepProfanityError: false,
      stepInputError: false,
      tooltipError: false,
      slowPlaybackTimeError: false
    },
    uiState: {
      disableTooltipSubmitBtn: true,
      isMounted: true
    },
    currentEditingIndex: null,
    isUpdateMode: false,
    recordingId: null
  }
}
```

## Troubleshooting

### Error: "Cannot find module '@digital-assistant/core'"
**Solution:**
1. Build core package: `cd packages/core && npm run build`
2. If still failing, check package linking or reinstall dependencies

### Error: "Property 'editableStepForm' does not exist on type 'RootState'"
**Solution:**
1. Verify you added the line to RootState interface
2. Restart TypeScript server (VS Code: Cmd/Ctrl + Shift + P > "Restart TS Server")

### Redux DevTools shows old state
**Solution:**
1. Hard refresh browser (Cmd/Ctrl + Shift + R)
2. Clear local storage and refresh
3. Check that store configuration was saved

## Next Steps

After successfully updating the store:

1. ✅ Replace EditableStepForm.tsx with EditableStepForm.new.tsx
   ```bash
   mv src/components/EditableStepForm.tsx src/components/EditableStepForm.old.tsx
   mv src/components/EditableStepForm.new.tsx src/components/EditableStepForm.tsx
   ```

2. ✅ Test recording mode (RecordedData.tsx)

3. ✅ Test update mode (RecordSequenceDetails.tsx)

4. ✅ Commit changes if all tests pass

---

**Quick Copy-Paste Version:**

```typescript
// Add to imports section
import { editableStepFormReducer } from '@digital-assistant/core';

// Add to store.reducer object
editableStepForm: editableStepFormReducer,

// Add to RootState interface
editableStepForm: ReturnType<typeof editableStepFormReducer>;
```

That's it! Three lines to add.
