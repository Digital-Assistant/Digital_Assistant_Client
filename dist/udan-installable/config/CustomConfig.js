/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config Objects
 */
// assigning default values to the default configuration
export const CustomConfig = {
    enableEditClickedName: false,
    enableSkipDuringPlay: false,
    enableTooltipAddition: true,
    enableMultilingual: false,
    enableNodeTypeSelection: true,
    enablePermissions: false,
    permissions: {},
    enableProfanity: false,
    enableRecording: true,
    enableOverlay: true,
    environment: 'PROD',
    enableUdaIcon: true,
    udaDivId: 'uda-nistapp-logo',
    enableForAllDomains: false,
    enableSpeechToText: false,
    enableSlowReplay: false,
    enableCustomIcon: false,
    customIcon: 'https://udan.nistapp.com/uda-logo.jpg',
    realm: process.env.keycloakRealm,
    clientId: process.env.keycloakClientId,
    clientSecret: process.env.keycloakClientSecret,
    enableHidePanelAfterCompletion: false
};
