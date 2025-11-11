/**
 * Check whether a DOM element has at least one of the specified CSS classes.
 *
 * Note: This utility intentionally mirrors the original UI logic (string
 * search on className) to preserve behavior during migration.
 *
 * @param element - The DOM element to check
 * @param classList - List of class names to look for
 * @returns True if any class from classList exists on the element
 */
export const hasClass = (element: HTMLElement, classList: string[]): boolean => {
  let existsFlag = false;
  classList?.forEach((cls) => {
    try {
      if (element?.className?.indexOf(cls) > -1) {
        existsFlag = true;
        return existsFlag;
      }
    } catch {
      /* ignore individual class check errors */
      return false;
    }
  });
  return existsFlag;
};

export default hasClass;
