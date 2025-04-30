/**
 * @fileoverview Compares two DOM nodes to determine their similarity.
 *
 * This module provides functionality to compare a node from the current DOM with a
 * previously recorded node. It calculates a similarity score based on matching attributes,
 * properties, and child nodes. The comparison is used during replay to find the best
 * matching element in the current DOM that corresponds to a recorded element.
 */

import {CONFIG} from "../config";
import {jaroWinkler} from "jaro-winkler-typescript";
import {UDAConsoleLogger, UDAErrorLogger} from "../config/error-log";
import {checkNodeValues} from "./checkNodeValues";

declare let udaSpecialNodes: {
  ignoreDuringCompare: {
    attributes: string[]
  }
};
declare const UDAGlobalConfig: {
  enableForAllDomains: boolean
};

/**
 * Interface for the match object that tracks comparison statistics
 */
interface NodeMatch {
  count: number;
  matched: number;
  unmatched: Array<{key: string, compareNodeValues: any, recordedNodeValues: any}>;
  innerTextFlag: boolean;
  innerChildNodes: number;
}

/**
 * Compares two DOM nodes to determine their similarity.
 *
 * @param {Object} compareNode - The node from the current DOM to compare.
 * @param {Object} recordedNode - The previously recorded node to compare against.
 * @param {boolean} isPersonalNode - Whether this is a personal node with special comparison rules.
 * @param {NodeMatch} match - The match object that tracks comparison statistics.
 * @returns {NodeMatch} The updated match object with comparison results.
 *
 * @example
 * const result = compareNodes(
 *   document.getElementById('current-button'),
 *   recordedButtonData,
 *   false,
 *   { count: 0, matched: 0, unmatched: [], innerTextFlag: false, innerChildNodes: 0 }
 * );
 *
 * if (result.matched / result.count > 0.8) {
 *   console.log('Found a good match!');
 * }
 */
export const compareNodes = (
    compareNode: any,
    recordedNode: any,
    isPersonalNode: boolean = false,
    match: NodeMatch = {
      count: 0,
      matched: 0,
      unmatched: [],
      innerTextFlag: false,
      innerChildNodes: 0
    }
): NodeMatch => {
  try {
    // Input validation
    if (!compareNode || !recordedNode) {
      UDAErrorLogger.error('compareNodes: Invalid input - compareNode or recordedNode is null/undefined');
      return match;
    }

    if (typeof compareNode !== 'object' || typeof recordedNode !== 'object') {
      UDAErrorLogger.error('compareNodes: Invalid input - compareNode or recordedNode is not an object', {
        compareNodeType: typeof compareNode,
        recordedNodeType: typeof recordedNode
      });
      return match;
    }

    // Validate udaSpecialNodes global
    if (!udaSpecialNodes ||
        !udaSpecialNodes.ignoreDuringCompare ||
        !Array.isArray(udaSpecialNodes.ignoreDuringCompare.attributes)) {
      UDAErrorLogger.warn('compareNodes: udaSpecialNodes.ignoreDuringCompare.attributes is not properly defined');
    }

    // sum the childnodes
    if (compareNode.hasOwnProperty('childNodes') && Array.isArray(compareNode.childNodes)) {
      match.innerChildNodes = match.innerChildNodes + compareNode.childNodes.length;
    }

    // Iterate through recorded node properties
    for (let key in recordedNode) {
      // Skip if key doesn't exist in recordedNode
      if (!Object.prototype.hasOwnProperty.call(recordedNode, key)) {
        continue;
      }

      // Input sanitization for key
      const sanitizedKey = sanitizeKey(key);
      if (sanitizedKey !== key) {
        UDAConsoleLogger.info(`compareNodes: Sanitized key "${key}" to "${sanitizedKey}"`);
        key = sanitizedKey;
      }

      /**
       * Angular provides Shadow_Dom like functionality called "View Encapsulation".
       * https://angular.io/guide/view-encapsulation,
       * https://javascript.plainenglish.io/angular-how-i-finally-understood-the-emulated-and-none-viewencapsulation-9c483e7e8d6b
       * Unfortunately, this functionality generates dynamic html attributes prefaced
       * by "_ng". For our purpose, we will have to ignore all attributes starting
       * with "_ng" while pattern matching during replay.
       * We may have to have similar solutions in the future for other frameworks like vue etc.
       */
      let ignoreAttribute: boolean = false;

      // Check if this attribute should be ignored based on configuration
      for(let ignoreText in CONFIG.ignoreDynamicAttributeText){
        // comparing the value whether it has the defined dynamicvalue position
        if(key.indexOf(ignoreText) !== -1){
          ignoreAttribute = true;
          break;
        }
      }

      if(ignoreAttribute === true){
        continue;
      }

      // Skip attributes that should be ignored during comparison
      if (udaSpecialNodes &&
          udaSpecialNodes.ignoreDuringCompare &&
          Array.isArray(udaSpecialNodes.ignoreDuringCompare.attributes) &&
          udaSpecialNodes.ignoreDuringCompare.attributes.indexOf(key) !== -1) {
        continue;
      } else if (key.indexOf('_ngcontent') !== -1 ||
          key.indexOf('jQuery') !== -1 ||
          key.indexOf('__zone_symbol__') !== -1) {
        continue;
      } else {
        match.count++;
      }

      // Compare nested objects recursively
      if (compareNode.hasOwnProperty(key) &&
          (typeof recordedNode[key] === 'object') &&
          recordedNode[key] !== null &&
          (typeof compareNode[key] === 'object') &&
          compareNode[key] !== null) {
        match.matched++;
        match = compareNodes(compareNode[key], recordedNode[key], isPersonalNode, match);
      }
      // Compare arrays
      else if (compareNode.hasOwnProperty(key) &&
          Array.isArray(recordedNode[key]) &&
          recordedNode[key].length > 0 &&
          Array.isArray(compareNode[key]) &&
          compareNode[key].length > 0) {
        match.matched++;
        // Special case for select elements
        if (compareNode.nodeName === 'select' && key === 'childNodes') {
          continue;
        } else if (compareNode[key].length === recordedNode[key].length) {
          match.matched++;
          for (let i = 0; i < recordedNode[key].length; i++) {
            match = compareNodes(compareNode[key][i], recordedNode[key][i], isPersonalNode, match);
          }
        }
      }
      // Compare class/className with special handling
      else if ((key === 'class' || key === 'className') &&
          recordedNode.hasOwnProperty(key) &&
          compareNode.hasOwnProperty(key)) {
        // Sanitize class values
        const sanitizedCompareClass = sanitizeClassValue(compareNode[key]);
        const sanitizedRecordedClass = sanitizeClassValue(recordedNode[key]);

        if (sanitizedCompareClass === sanitizedRecordedClass) {
          match.matched++;
        } else {
          // Use Jaro-Winkler for fuzzy matching of class names
          try {
            let weight = jaroWinkler(sanitizedRecordedClass, sanitizedCompareClass);
            if (weight > CONFIG.JARO_WEIGHT_PERSONAL) {
              match.matched++;
            } else {
              match.unmatched.push({
                key: key,
                compareNodeValues: sanitizedCompareClass,
                recordedNodeValues: sanitizedRecordedClass
              });
            }
          } catch (error) {
            UDAErrorLogger.error('compareNodes: Error in Jaro-Winkler comparison', {
              error,
              key,
              compareNodeValues: sanitizedCompareClass,
              recordedNodeValues: sanitizedRecordedClass
            });
            match.unmatched.push({
              key: key,
              compareNodeValues: sanitizedCompareClass,
              recordedNodeValues: sanitizedRecordedClass
            });
          }
        }
      }
      // Compare innerText with case-insensitive matching
      else if (key === 'innerText' &&
          recordedNode.hasOwnProperty(key) &&
          compareNode.hasOwnProperty(key) &&
          typeof compareNode[key] === 'string' &&
          typeof recordedNode[key] === 'string' &&
          (compareNode[key].trim().toLowerCase() === recordedNode[key].trim().toLowerCase())) {
        UDAConsoleLogger.info(`compareNodes: innerText match - "${compareNode[key].trim()}"`);
        match.innerTextFlag = true;
        match.matched = match.matched + CONFIG.innerTextWeight;
      }
      // Exact match for other properties
      else if (compareNode.hasOwnProperty(key) && compareNode[key] === recordedNode[key]) {
        match.matched++;
      }
      // Special handling for href (partial matching)
      else if (compareNode.hasOwnProperty(key) &&
          compareNode[key] !== recordedNode[key] &&
          key === 'href' &&
          typeof compareNode[key] === 'string' &&
          typeof recordedNode[key] === 'string' &&
          recordedNode[key].indexOf(compareNode[key]) !== -1) {
        match.matched++;
      }
      // Fuzzy matching for id/name using Jaro-Winkler
      else if (compareNode.hasOwnProperty(key) &&
          (key === 'id' || key === 'name') &&
          compareNode[key] !== recordedNode[key] &&
          typeof compareNode[key] === 'string' &&
          typeof recordedNode[key] === 'string') {
        try {
          let weight = jaroWinkler(recordedNode[key], compareNode[key]);
          if (weight > 0.90) {
            match.matched++;
          } else {
            match.unmatched.push({
              key: key,
              compareNodeValues: compareNode[key],
              recordedNodeValues: recordedNode[key]
            });
          }
        } catch (error) {
          UDAErrorLogger.error('compareNodes: Error in Jaro-Winkler comparison for id/name', {
            error,
            key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: recordedNode[key]
          });
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: recordedNode[key]
          });
        }
      }
      // Handle empty innerText/outerText
      else if ((key === 'innerText' || key === 'outerText') &&
          typeof compareNode[key] === 'undefined') {
        // fix for element innerText or OuterText if empty got recorded.
        let trimmedRecordedNode = typeof recordedNode[key] === 'string' ?
            recordedNode[key].trim() :
            String(recordedNode[key]).trim();

        if(trimmedRecordedNode === null ||
            trimmedRecordedNode === '' ||
            trimmedRecordedNode === 'null') {
          match.matched++;
        } else if(isPersonalNode && (
            trimmedRecordedNode === null ||
            trimmedRecordedNode === '' ||
            trimmedRecordedNode === 'null' ||
            compareNode[key] === undefined)) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: recordedNode[key]
          });
        }
      }
      // Special handling for personal nodes
      else if (isPersonalNode && CONFIG.personalNodeIgnoreAttributes.indexOf(key) !== -1) {
        // make inner text flag to true if personal tag is true
        if (key === 'innerText') {
          match.innerTextFlag = true;
          match.matched = match.matched + CONFIG.innerTextWeight;
        } else {
          match.matched++;
        }
      }
      // Special handling for domain-related properties when enableForAllDomains is true
      else if(UDAGlobalConfig &&
          UDAGlobalConfig.enableForAllDomains &&
          (key === 'origin' || key === 'href' || key === 'host' ||
              key === 'hostname' || key === 'search')) {
        match.matched++;
      }
      // Record unmatched properties
      else {
        match.unmatched.push({
          key: key,
          compareNodeValues: compareNode[key],
          recordedNodeValues: recordedNode[key]
        });
      }
    }

    return match;
  } catch (error) {
    UDAErrorLogger.error('compareNodes: Unexpected error during node comparison', {
      error,
      compareNode: typeof compareNode,
      recordedNode: typeof recordedNode,
      isPersonalNode
    });
    return match;
  }
};

/**
 * Sanitizes a class value by removing common dynamic classes and trimming whitespace.
 *
 * @param {string} classValue - The class value to sanitize.
 * @returns {string} The sanitized class value.
 * @private
 */
function sanitizeClassValue(classValue: string): string {
  if (typeof classValue !== 'string') {
    return String(classValue || '').trim();
  }

  return classValue
      .replace(' ng-star-inserted', '')
      .replace('disabled', '')
      .replace('writeInput', '')
      .replace('undefined', '')
      .trim();
}

/**
 * Sanitizes a key to prevent potential security issues.
 *
 * @param {string} key - The key to sanitize.
 * @returns {string} The sanitized key.
 * @private
 */
function sanitizeKey(key: string): string {
  if (typeof key !== 'string') {
    return String(key || '');
  }

  // Remove any potentially dangerous characters
  return key.replace(/[^\w\d\-_]/g, '_');
}
