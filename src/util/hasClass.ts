/**
 * To find an dom object has a given class
 * @param element
 * @param classList
 * @returns
 */
export const hasClass = (element: HTMLElement, classList: string[]) => {
  let existsFlag = false;
  classList?.forEach(cls => {
    try {
      if (element?.className?.indexOf(cls) > -1) {
        existsFlag = true;
        return existsFlag;
      }
    } catch (e) {
      return false
    }
  });
  return existsFlag;
}
