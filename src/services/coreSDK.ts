import { DigitalAssistantCore } from "@digital-assistant/core";

// Ensure global type definition if needed, or cast window
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalConfig = (window as any).UDAPluginSDK;

// Export a single shared instance
export const DigitalAssistantCoreSDK = new DigitalAssistantCore(globalConfig);
