/**
 * Author: Yureswar Ravuri
 * Type: common utilities
 * Objective: To create and export all the common utilities
 */
import {CONFIG} from "../config/endpoints";
import { trigger } from "./events";
import { UdaData } from "../types";

export const setToStore = (value: any, key: string, isGlobal?: boolean) => {
    if (isGlobal) {
        let udaData = window.localStorage.getItem(CONFIG.UDA_DATA_KEY);
        if (udaData) {
            let udaJson: UdaData = JSON.parse(udaData);
            udaJson[key] = value;
            window.localStorage.setItem(CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        } else {
            let udaJson: UdaData = {};
            udaJson[key] = value;
            window.localStorage.setItem(CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
    } else {
        let udaData = window.sessionStorage.getItem(CONFIG.UDA_DATA_KEY);
        if (udaData) {
            let udaJson: UdaData = JSON.parse(udaData);
            udaJson[key] = value;
            window.sessionStorage.setItem(
                CONFIG.UDA_DATA_KEY,
                JSON.stringify(udaJson)
            );
        } else {
            let udaJson: UdaData = {};
            udaJson[key] = value;
            window.sessionStorage.setItem(
                CONFIG.UDA_DATA_KEY,
                JSON.stringify(udaJson)
            );
        }
    }
};

export const getFromStore = (key: string, isGlobal?: boolean) => {
    if (isGlobal) {
        let udaData = window.localStorage.getItem(CONFIG.UDA_DATA_KEY);
        if (udaData) {
            let udaJson = JSON.parse(udaData);
            if (udaJson) {
                return udaJson[key];
            }
        }
    } else {
        let udaData = window.sessionStorage.getItem(CONFIG.UDA_DATA_KEY);
        if (udaData) {
            let udaJson = JSON.parse(udaData);
            if (udaJson) {
                return udaJson[key];
            }
        }
    }
    return;
};

export const removeFromStore = (key: string) => {
    let udaSessionData = window.sessionStorage.getItem(CONFIG.UDA_DATA_KEY);
    if (udaSessionData) {
        let udaJson = JSON.parse(udaSessionData);
        if (udaJson && udaJson[key]) {
            delete udaJson[key];
            window.sessionStorage.setItem(
                CONFIG.UDA_DATA_KEY,
                JSON.stringify(udaJson)
            );
        }
    }
    let udaLocalData = window.localStorage.getItem(CONFIG.UDA_DATA_KEY);
    if (udaLocalData) {
        let udaJson = JSON.parse(udaLocalData);
        if (udaJson && udaJson[key]) {
            delete udaJson[key];
            window.localStorage.setItem(
                CONFIG.UDA_DATA_KEY,
                JSON.stringify(udaJson)
            );
        }
    }
};

export const squeezeBody = (isSqueezed: boolean) => {
    let documentBody = document.body;
    if (isSqueezed) {
        if (!documentBody.classList.contains("uda-squeeze")) {
            documentBody.classList.add("uda-squeeze");
            trigger("uda-squeeze");
        }
    } else {
        if (documentBody.classList.contains("uda-squeeze")) {
            documentBody.classList.remove("uda-squeeze");
            trigger("uda-unsqueeze");
        }
    }
};
