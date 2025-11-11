// Export special nodes configuration
export { specialNodes } from './specialNodes';

// Export URL processing utilities
export { processUrlArgs, buildQueryParams, buildUrl } from './urlProcessing';

// Recording utilities
export { simulateHover } from './recording/simulateHover';
export { simulateMouseLeave } from './recording/simulateMouseLeave';
export { addBodyEvents } from './recording/addBodyEvents';
export { initSpecialNodes } from './recording/initSpecialNodes';
export { isClickableNode } from './recording/isClickableNode';
export { getObjData } from './recording/getObjectData';

// Headers click tracking (migrated from src/Headers.js)
export { initClickTracking, teardownClickTracking } from './headers/initializeClickTracking';

// Playback identification helpers
export { findRecordedElement } from './playback/findRecordedElement';
export { searchNodes } from './playback/searchNodes';
export { processDistanceOfNodes } from './playback/processDistanceOfNodes';
export { getClickedInputLabels } from './playback/getClickedInputLabels';

// Node special checks
export { checkNodeValues } from './checkNodeValues';
export { checkNodeObjectKeyValue } from './checkNodeObjectKeyValue';
export { hasClass } from './hasClass';

// Domain and offsets wrappers
export { fetchDomain } from './fetchDomain';
export { getAbsoluteOffsets } from './getAbsoluteOffsets';

// Storage utilities
import { StorageUtil } from './storage';
export const setToStore = StorageUtil.add;
