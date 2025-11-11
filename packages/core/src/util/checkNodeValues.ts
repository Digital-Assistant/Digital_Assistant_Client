import { checkNodeObjectKeyValue } from './checkNodeObjectKeyValue';

// Maintain compatibility with original global usage
// global.udaSpecialNodes is the source of truth filled by initSpecialNodes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const udaSpecialNodes: any;

/**
 * Check whether a node exists in the given special-nodes category.
 * Logic preserved from the original implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkNodeValues = (node: any, checkType: string): boolean => {
  let exists = false;
  try {
    // Match original behavior: read from global.udaSpecialNodes
    // to allow utilities to work outside service instances
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((udaSpecialNodes as any)?.[checkType] && node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const bag = (udaSpecialNodes as any)[checkType];
      // Iterate keys and use checkNodeObjectKeyValue for actual matching
      // This preserves original control-flow and early break behavior
      checkNodeLoop: for (const key in bag) {
        if (checkNodeObjectKeyValue(node, key, bag[key], checkType)) {
          exists = true;
          break checkNodeLoop;
        }
      }
    }
  } catch {
    // swallow errors to avoid breaking page logic
  }
  return exists;
};
