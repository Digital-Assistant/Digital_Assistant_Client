/**
 * Author: Yureswar Ravuri
 * Type: common utilities
 * Objective: To create and export all the common event handlers
 */
export const on = (
    eventType: string,
    listener: any,
    target: any = document
) => {
    target.addEventListener(eventType, listener);
};

export const off = (
    eventType: string,
    listener: any,
    target: any = document
) => {
    target.removeEventListener(eventType, listener);
};

export const trigger = (
    eventType: string,
    data?: any,
    target: any = document
) => {
    const event = new CustomEvent(eventType, data);
    target.dispatchEvent(event);
};
