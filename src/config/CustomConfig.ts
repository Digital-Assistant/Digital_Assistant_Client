/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config Objects
 */

export interface CustomConfigPropTypes {
  enableEditClickedName: boolean,
  enableSkipDuringPlay: boolean,
  enableTooltip: boolean,
  enableMultilingual: boolean,
  enablePermissions: boolean,
  permissions: object,
  enableProfanity: boolean,
  enableNodeTypeSelection: boolean
  enableRecording: boolean,
  enableOverlay: boolean
}

// assigning default values to the default configuration
export const CustomConfig: CustomConfigPropTypes = {
  enableEditClickedName: true, // Flag for editing the clicked element
  enableSkipDuringPlay: true, // Flag for enabling skip functionality
  enableTooltip: true, // Flag for adding custom tooltip information
  enableMultilingual: false, // Flag for enabling multilingual search with speech
  enableNodeTypeSelection: true, // Flag for enabling node type selection
  enablePermissions: false, // Flag for enabling permissions addition
  permissions: {}, // Object where the permissions can be passed
  enableProfanity: true, // Flag for enabling profanity check
  enableRecording: true, // Flag for enabling recording functionality
  enableOverlay: false // Flag for enabling overlay functionality or enabling squeeze functionality
};
