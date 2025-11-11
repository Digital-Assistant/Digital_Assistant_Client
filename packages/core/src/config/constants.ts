// packages/core/src/config/constants.ts
// Minimal configuration constants needed by the core SDK

export const CONFIG = {
  // Storage key used to persist active recording sequence (matches UI)
  RECORDING_SEQUENCE: 'UDAActiveRecordingData',
  // Storage key used to persist manual play mode
  RECORDING_MANUAL_PLAY: 'UDAManualPlay',
  // Storage key used to persist selected recording details
  SELECTED_RECORDING: 'UDASelectedRecordedItem',
  // DOM-related constants for container and ignore class
  UDA_CONTAINER_CLASS: 'udan-main-panel',
  UDA_CLICK_IGNORE_CLASS: 'uda_exclude',
};
