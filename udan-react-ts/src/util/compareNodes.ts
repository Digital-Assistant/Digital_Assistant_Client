//comparing nodes of indexed and the sequence step selected
import {CONFIG} from "../config";
import {jaroWinkler} from "jaro-winkler-typescript";
import {UDAConsoleLogger} from "../config/error-log";

export const compareNodes = (compareNode, originalNode, isPersonalNode = false, match = {
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
  for (let key in originalNode) {
    if (CONFIG.ignoreAttributes.indexOf(key) !== -1) {
      continue;
    } else if (key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1) {
      continue;
    } else {
      match.count++;
    }
    if (compareNode.hasOwnProperty(key) && (typeof originalNode[key] === 'object') && (typeof compareNode[key] === 'object')) {
      match.matched++;
      match = compareNodes(compareNode[key], originalNode[key], isPersonalNode, match);
    } else if (compareNode.hasOwnProperty(key) && Array.isArray(originalNode[key]) && originalNode[key].length > 0 && Array.isArray(compareNode[key]) && compareNode[key].length > 0) {
      match.matched++;
      if (compareNode.nodeName === 'select' && key === 'childNodes') {
        continue;
      } else if (compareNode[key].length === originalNode[key].length) {
        match.matched++;
        for (let i = 0; i < originalNode[key].length; i++) {
          match = compareNodes(compareNode[key][i], originalNode[key][i], isPersonalNode, match);
        }
      }
    } else if ((key === 'class' || key === 'className') && originalNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key)) {
      // fix for calendar issue
      compareNode[key] = compareNode[key].replace(' ng-star-inserted', '');
      originalNode[key] = originalNode[key].replace(' ng-star-inserted', '');
      if (compareNode[key] === originalNode[key]) {
        match.matched++;
      } else {
        // jaro wrinker comparision for classname
        let weight = jaroWinkler(originalNode[key], compareNode[key]);
        if (weight > CONFIG.JARO_WEIGHT_PERSONAL) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: originalNode[key]
          });
        }
      }
    } else if (key === 'innerText' && originalNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key) && (compareNode[key].trim() === originalNode[key].trim())) {
      // matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
      // since this will match for every child node, we need to accommodate this logic whenever 'comparenodes' is called
      UDAConsoleLogger.info(compareNode[key].trim());
      UDAConsoleLogger.info(originalNode[key].trim());
      match.innerTextFlag = true;
      match.matched = match.matched + CONFIG.innerTextWeight;
      // match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] === originalNode[key]) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] !== originalNode[key] && key === 'href' && originalNode[key].indexOf(compareNode[key]) !== -1) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && (key === 'id' || key === 'name') && compareNode[key] !== originalNode[key]) {
      let weight = jaroWinkler(originalNode[key], compareNode[key]);
      if (weight > 0.90) {
        match.matched++;
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
    } else {
      match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: originalNode[key]});
    }
  }
  return match;
}
