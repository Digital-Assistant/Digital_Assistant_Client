/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config Objects
 */
export interface CustomConfigPropTypes {
    [key: string]: any;
    enableEditClickedName: boolean;
    enableSkipDuringPlay: boolean;
    enableTooltipAddition: boolean;
    enableMultilingual: boolean;
    enablePermissions: boolean;
    permissions: object;
    enableProfanity: boolean;
    enableNodeTypeSelection: boolean;
    enableRecording: boolean;
    enableOverlay: boolean;
    environment: string;
    enableUdaIcon: boolean;
    udaDivId: string;
    enableForAllDomains: boolean;
    enableSpeechToText: boolean;
    enableSlowReplay: boolean;
    enableCustomIcon: boolean;
    customIcon: string;
    realm: string;
    clientId: string;
    clientSecret: string;
    enableHidePanelAfterCompletion: boolean;
    enableStatusSelection: boolean;
    enableUDAIconDuringRecording: boolean;
    enableEditingOfRecordings: boolean;
}
export declare const CustomConfig: CustomConfigPropTypes;
