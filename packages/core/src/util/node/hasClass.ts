/**
 * Checks if an HTML element has at least one of the specified CSS classes.
 * This function iterates through a list of class names and checks if any of them exist
 * in the element's `className` property.
 *
 * @param element The HTML element to check for classes.
 * @param classList An array of strings, where each string is a class name to look for.
 * @returns `true` if the element has at least one of the specified classes, `false` otherwise.
 */
export const hasClass = (element: HTMLElement, classList: string[]) => {
  let existsFlag = false;
  // Iterate over the list of class names provided.
  classList?.forEach(cls => {
    try {
      // Check if the class exists in the element's className string.
      // Using `indexOf` is a simple way to check for the presence of the class.
      if (element?.className?.indexOf(cls) > -1) {
        existsFlag = true;
        // Note: `return` inside a `forEach` does not exit the outer function,
        // but it will stop the current iteration. The flag is used to track if a class was found.
        return;
      }
    } catch (e) {
      // If an error occurs (e.g., if the element is invalid), return false for this iteration.
      return false;
    }
  });
  // Return the final flag, which indicates if any class was found.
  return existsFlag;
}
