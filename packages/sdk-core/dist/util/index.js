"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squeezeBody = exports.removeFromStore = exports.getFromStore = exports.setToStore = void 0;
/**
 * Author: Yureswar Ravuri
 * Type: common utilities
 * Objective: To create and export all the common utilities
 */
var endpoints_1 = require("../config/endpoints");
var events_1 = require("./events");
var setToStore = function (value, key, isGlobal) {
    if (isGlobal) {
        var udaData = window.localStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
        if (udaData) {
            var udaJson = JSON.parse(udaData);
            udaJson[key] = value;
            window.localStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
        else {
            var udaJson = {};
            udaJson[key] = value;
            window.localStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
    }
    else {
        var udaData = window.sessionStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
        if (udaData) {
            var udaJson = JSON.parse(udaData);
            udaJson[key] = value;
            window.sessionStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
        else {
            var udaJson = {};
            udaJson[key] = value;
            window.sessionStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
    }
};
exports.setToStore = setToStore;
var getFromStore = function (key, isGlobal) {
    if (isGlobal) {
        var udaData = window.localStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
        if (udaData) {
            var udaJson = JSON.parse(udaData);
            if (udaJson) {
                return udaJson[key];
            }
        }
    }
    else {
        var udaData = window.sessionStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
        if (udaData) {
            var udaJson = JSON.parse(udaData);
            if (udaJson) {
                return udaJson[key];
            }
        }
    }
    return;
};
exports.getFromStore = getFromStore;
var removeFromStore = function (key) {
    var udaSessionData = window.sessionStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
    if (udaSessionData) {
        var udaJson = JSON.parse(udaSessionData);
        if (udaJson && udaJson[key]) {
            delete udaJson[key];
            window.sessionStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
    }
    var udaLocalData = window.localStorage.getItem(endpoints_1.CONFIG.UDA_DATA_KEY);
    if (udaLocalData) {
        var udaJson = JSON.parse(udaLocalData);
        if (udaJson && udaJson[key]) {
            delete udaJson[key];
            window.localStorage.setItem(endpoints_1.CONFIG.UDA_DATA_KEY, JSON.stringify(udaJson));
        }
    }
};
exports.removeFromStore = removeFromStore;
var squeezeBody = function (isSqueezed) {
    var documentBody = document.body;
    if (isSqueezed) {
        if (!documentBody.classList.contains("uda-squeeze")) {
            documentBody.classList.add("uda-squeeze");
            (0, events_1.trigger)("uda-squeeze");
        }
    }
    else {
        if (documentBody.classList.contains("uda-squeeze")) {
            documentBody.classList.remove("uda-squeeze");
            (0, events_1.trigger)("uda-unsqueeze");
        }
    }
};
exports.squeezeBody = squeezeBody;
