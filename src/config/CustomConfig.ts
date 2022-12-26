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
  enableEditClickedName: true,
  enableSkipDuringPlay: true,
  enableTooltip: true,
  enableMultilingual: true,
  enableNodeTypeSelection: true,
  enablePermissions: false,
  permissions: {},
  enableProfanity: true,
  enableRecording: true,
  enableOverlay: true
};
