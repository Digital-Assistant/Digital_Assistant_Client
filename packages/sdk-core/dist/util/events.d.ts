/**
 * Author: Yureswar Ravuri
 * Type: common utilities
 * Objective: To create and export all the common event handlers
 */
export declare const on: (eventType: string, listener: any, target?: any) => void;
export declare const off: (eventType: string, listener: any, target?: any) => void;
export declare const trigger: (eventType: string, data?: any, target?: any) => void;
