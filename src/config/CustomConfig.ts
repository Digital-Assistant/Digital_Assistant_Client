/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config Objects
 */

export interface CustomConfigPropTypes {
  enableEditClickedName: boolean,
  enableSkipDuringPlay: boolean,
  enableTooltipAddition: boolean,
  enableMultilingual: boolean,
  enablePermissions: boolean,
  permissions: object,
  enableProfanity: boolean,
  enableNodeTypeSelection: boolean
  enableRecording: boolean,
  enableOverlay: boolean,
  environment: string,
  enableUdaIcon: boolean,
  udaDivId: string,
  enableForAllDomains: boolean,
  enableSpeechToText: boolean,
  enableSlowReplay: boolean,
  enableCustomIcon: boolean,
  customIcon: string,
  realm: string,
  clientId: string,
  clientSecret: string,
  enableHidePanelAfterCompletion: boolean,
  enableStatusSelection: boolean,
  enableUDAIconDuringRecording: boolean,
  enableEditingOfRecordings: boolean
}

// assigning default values to the default configuration
export const CustomConfig: CustomConfigPropTypes = {
  enableEditClickedName: true, // Flag for editing the clicked element
  enableSkipDuringPlay: true, // Flag for enabling skip functionality
  enableTooltipAddition: true, // Flag for adding custom tooltip information
  enableMultilingual: true, // Flag for enabling multilingual search with speech
  enableNodeTypeSelection: true, // Flag for enabling node type selection
  enablePermissions: true, // Flag for enabling permissions addition
  permissions: {"user": true, "admin": true}, // Object where the permissions can be passed
  enableProfanity: false, // Flag for enabling profanity check
  enableRecording: true, // Flag for enabling recording functionality
  enableOverlay: true, // Flag for enabling overlay functionality or enabling squeeze functionality
  environment: 'PROD', // Environment variable
  enableUdaIcon: true, // Flag for enabling UDA icon
  udaDivId: 'uda-nistapp-logo',
  enableForAllDomains: true, // Flag to enable all the recording to be visible across all domains
  enableSpeechToText: true, // Flag to enable speech to text
  enableSlowReplay: true, // Flag to enable slow playback
  enableCustomIcon: false, // Flag to enable custom icon
  customIcon: 'https://udan.nistapp.com/uda-logo.jpg', // Custom icon URL
  realm: process.env.keycloakRealm, // Realm name to be used for authentication
  clientId: process.env.keycloakClientId, // Client ID to be used for authentication
  clientSecret: process.env.keycloakClientSecret, // Client secret to be used for authentication
  enableHidePanelAfterCompletion: true, // Flag to enable hiding the panel after completion
  enableStatusSelection: true, // Flag to enable status selection
  enableUDAIconDuringRecording: true, // Flag to enable UDA icon during recording
  enableEditingOfRecordings: true // Flag to enable editing of recordings
};
