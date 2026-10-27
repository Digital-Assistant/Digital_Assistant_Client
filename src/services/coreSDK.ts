import { DigitalAssistantCore, DigitalAssistantConfiguration, AppConfig, CustomConfig, CONFIG } from "@udan/digital-assistant-sdk";

// Initialize Core SDK
const config = new DigitalAssistantConfiguration(CONFIG);
// Translate is switched off until it is redesigned (the Google Translate key was removed; see docs/TODO.md "Redesign translate").
// Remove this line when the redesigned translate lands.
CustomConfig.enableMultilingual = false;
// Apply default CustomConfig configuration
AppConfig(CustomConfig);

export const coreSDK = new DigitalAssistantCore(config);
