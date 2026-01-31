import { DigitalAssistantCore, DigitalAssistantConfiguration, AppConfig, CustomConfig, CONFIG } from "@digital-assistant/core";

// Initialize Core SDK
const config = new DigitalAssistantConfiguration(CONFIG);
// Apply default CustomConfig configuration
AppConfig(CustomConfig);

export const coreSDK = new DigitalAssistantCore(config);
