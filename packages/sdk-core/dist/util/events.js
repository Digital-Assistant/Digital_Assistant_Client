"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trigger = exports.off = exports.on = void 0;
/**
 * Author: Yureswar Ravuri
 * Type: common utilities
 * Objective: To create and export all the common event handlers
 */
var on = function (eventType, listener, target) {
    if (target === void 0) { target = document; }
    target.addEventListener(eventType, listener);
};
exports.on = on;
var off = function (eventType, listener, target) {
    if (target === void 0) { target = document; }
    target.removeEventListener(eventType, listener);
};
exports.off = off;
var trigger = function (eventType, data, target) {
    if (target === void 0) { target = document; }
    var event = new CustomEvent(eventType, data);
    target.dispatchEvent(event);
};
exports.trigger = trigger;
