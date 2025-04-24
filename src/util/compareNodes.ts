//comparing nodes of indexed and the sequence step selected
import {CONFIG} from "../config";
import {jaroWinkler} from "jaro-winkler-typescript";
import {UDAConsoleLogger} from "../config/error-log";
import {checkNodeValues} from "./checkNodeValues";

declare let udaSpecialNodes;
declare const UDAGlobalConfig;

export const compareNodes = (compareNode, recordedNode, isPersonalNode = false, match = {
  count: 0,
  matched: 0,
  unmatched: [],
  innerTextFlag: false,
  innerChildNodes: 0
}) => {
  // sum the childnodes
  if (compareNode.hasOwnProperty('childNodes')) {
    match.innerChildNodes = match.innerChildNodes + compareNode.childNodes.length;
  }
  for (let key in recordedNode) {

    /**
    * Angular provides Shadow_Dom like functionality called "Vliew Encapsulation".
    * https://angular.io/guide/view-encapsulation,
    * https://javascript.plainenglish.io/angular-how-i-finally-understood-the-emulated-and-none-viewencapsulation-9c483e7e8d6b
    * Unfortunately, this functionality generates dynamic html attributes prefaced
    *  by "_ng". For our purpose, we will have to ignore all attributes starting
    *  with "_ng" while pattern matching during replay.
    * We may have to have similar solutions in the future for other frameworks like vue etc.
    */
    let ignoreAttribute: boolean = false;
    for(let ignoreText in CONFIG.ignoreDynamicAttributeText){
      // comparing the value whether it has the defined dynamicvalue position
      if(key.indexOf(ignoreText) !== -1){
        ignoreAttribute = true;
      }
    }

    if(ignoreAttribute === true){
      continue;
    }

    /*if (checkNodeValues(compareNode, 'ignoreDuringCompare')) {
      continue;
    }*/
    // CONFIG.ignoreAttributes.indexOf(key) !== -1 ||
    if (udaSpecialNodes.ignoreDuringCompare.attributes.indexOf(key) !== -1) {
      continue;
    } else if (key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1) {
      continue;
    } else {
      match.count++;
    }
    if (compareNode.hasOwnProperty(key) && (typeof recordedNode[key] === 'object') && (typeof compareNode[key] === 'object')) {
      match.matched++;
      match = compareNodes(compareNode[key], recordedNode[key], isPersonalNode, match);
    } else if (compareNode.hasOwnProperty(key) && Array.isArray(recordedNode[key]) && recordedNode[key].length > 0 && Array.isArray(compareNode[key]) && compareNode[key].length > 0) {
      match.matched++;
      if (compareNode.nodeName === 'select' && key === 'childNodes') {
        continue;
      } else if (compareNode[key].length === recordedNode[key].length) {
        match.matched++;
        for (let i = 0; i < recordedNode[key].length; i++) {
          match = compareNodes(compareNode[key][i], recordedNode[key][i], isPersonalNode, match);
        }
      }
    } else if ((key === 'class' || key === 'className') && recordedNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key)) {
      // fix for calendar issue
      compareNode[key] = compareNode[key].replace(' ng-star-inserted', '').replace('disabled', '').replace('writeInput', '').replace('undefined','').trim();
      recordedNode[key] = recordedNode[key].replace(' ng-star-inserted', '').replace('disabled', '').replace('writeInput', '').replace('undefined','').trim();
      if (compareNode[key] === recordedNode[key]) {
        match.matched++;
      } else {
        // jaro wrinker comparision for classname
        let weight = jaroWinkler(recordedNode[key], compareNode[key]);
        if (weight > CONFIG.JARO_WEIGHT_PERSONAL) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: recordedNode[key]
          });
        }
      }
    } else if (key === 'innerText' && recordedNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key) && (compareNode[key].trim().toLowerCase() === recordedNode[key].trim().toLowerCase())) {
      // matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
      // since this will match for every child node, we need to accommodate this logic whenever 'comparenodes' is called
      UDAConsoleLogger.info(compareNode[key].trim());
      UDAConsoleLogger.info(recordedNode[key].trim());
      match.innerTextFlag = true;
      match.matched = match.matched + CONFIG.innerTextWeight;
      // match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] === recordedNode[key]) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] !== recordedNode[key] && key === 'href' && recordedNode[key].indexOf(compareNode[key]) !== -1) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && (key === 'id' || key === 'name') && compareNode[key] !== recordedNode[key]) {
      let weight = jaroWinkler(recordedNode[key], compareNode[key]);
      if (weight > 0.90) {
        match.matched++;
      }
    } else if ((key === 'innerText' || key === 'outerText') && typeof compareNode[key] === 'undefined') {
      // fix for element innerText or OuterText if empty got recorded.
      let trimmedRecordedNode = recordedNode[key].trim();
      if(trimmedRecordedNode === null || trimmedRecordedNode === '' || trimmedRecordedNode === 'null') {
        match.matched++;
      } else if(isPersonalNode && (trimmedRecordedNode === null || trimmedRecordedNode === '' || trimmedRecordedNode === 'null' || compareNode[key] === undefined)) {
        match.matched++;
      } else {
        match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: recordedNode[key]});
      }
    }
    // matching personal node key value pairs for personal tag true
    else if (isPersonalNode && CONFIG.personalNodeIgnoreAttributes.indexOf(key) !== -1) {
      // make inner text flag to true if personal tag is true
      if (key === 'innerText') {
        match.innerTextFlag = true;
        match.matched = match.matched + CONFIG.innerTextWeight;
      } else {
        match.matched++;
      }
    }
    // ignoring elements if the flag enable for all domains is true
    else if(UDAGlobalConfig.enableForAllDomains && (key === 'origin' || key === 'href' || key === 'host' || key === 'hostname' || key === 'search')) {
      match.matched++;
    } else {
      match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: recordedNode[key]});
    }
  }
  return match;
}
