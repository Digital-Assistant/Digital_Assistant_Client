/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Find a DOM element corresponding to a recorded node payload.
 *
 * This mirrors the primary matching flow used during autoplay (matchNode fast-path):
 * - If the recorded element is a common tag with className, construct a querySelector of tag.class combos
 * - Else, scan by tagName
 * - Prefer exact offset (x,y) match when available
 * - If no exact match is found, do NOT pick an arbitrary candidate — return null so
 *   legacy fallbacks (searchNodes/processDistanceOfNodes) can be applied by the caller.
 */

import { getAbsoluteOffsets } from '../getAbsoluteOffsets';
import { searchNodes } from './searchNodes';

// Minimal CONFIG shim for required constants used by original flow
const COMMON_TAGS = ['span', 'div'];

/**
 * Extract the JSON object stored in recordedNode.node.objectdata (safe parser).
 */
const safeGetObjectData = (recordedNode: any): any => {
  try {
    const str = recordedNode?.node?.objectdata || '{}';
    return JSON.parse(str);
  } catch {
    return {};
  }
};

/**
 * Attempt to build a CSS selector from nodeName + className tokens.
 */
const buildClassSelector = (nodeName: string, className: string): string => {
  if (!className) return '';
  const tokens = String(className)
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  let selector = '';
  for (const cls of tokens) {
    if (selector !== '') selector += ', ';
    selector += `${nodeName.toLowerCase()}.${cls}`;
  }
  return selector;
};

/**
 * Main finder function
 * @param recordedNode - The item from userclicknodesSet (or similar) containing { node: { objectdata: string } }
 * @returns HTMLElement | null
 */
export const findRecordedElement = (recordedNode: any): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  if (!recordedNode?.node?.objectdata) return null;

  const originalNode = safeGetObjectData(recordedNode);
  const originalElement = originalNode?.node;
  if (!originalElement?.nodeName) return null;

  let candidates: NodeListOf<Element> | Element[] = [];
  const compareElements: Array<{ nodeName: string; node: Element }> = [];

  // Step 1: If common tag with className, build a selector for each class
  try {
    if (
      COMMON_TAGS.includes(String(originalElement.nodeName).toLowerCase()) &&
      originalElement?.className
    ) {
      const selector = buildClassSelector(originalElement.nodeName, originalElement.className);
      if (selector) {
        candidates = document.querySelectorAll(selector);
      }
    }
  } catch {
    // ignore selector errors
  }

  // Step 2: Fallback to tag scan if none found
  if (!candidates || (candidates as any).length === 0) {
    try {
      candidates = Array.from(
        document.getElementsByTagName(String(originalElement.nodeName))
      );
    } catch {
      candidates = [];
    }
  }

  // Step 3: Iterate candidates: case-insensitive tag match, prefer exact offset; collect compareElements
  const offsets = originalElement?.offset;
  let exactMatch: HTMLElement | null = null;
  if ((candidates as any).length > 0) {
    for (const el of candidates as any) {
      try {
        const nameEq = String((el as HTMLElement).nodeName).toLowerCase() === String(originalElement.nodeName).toLowerCase();
        if (nameEq) {
          if (offsets) {
            const off = getAbsoluteOffsets(el as HTMLElement);
            if (off.x == offsets.x && off.y == offsets.y) {
              exactMatch = el as HTMLElement;
              break;
            }
          }
          compareElements.push({ nodeName: (el as HTMLElement).nodeName, node: el as HTMLElement });
        }
      } catch {
        // ignore
      }
    }
  }

  if (exactMatch) return exactMatch;

  // Step 4: Apply legacy fallback search using compareElements (mirrors matchNode)
  if (compareElements.length > 0) {
    const fallback = searchNodes(recordedNode, compareElements);
    return (fallback as HTMLElement) || null;
  }

  return null;
};
