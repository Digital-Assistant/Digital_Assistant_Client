/**
 * Sets the value of an input element and triggers necessary events.
 * @param selector - The CSS selector to select the input element.
 * @param value - The value to set.
 */
export const setInputValue = (node: HTMLInputElement, value: string) => {
    const inputElement = node;
    if (inputElement) {
        // Set the value of the input element
        console.log(value);
        inputElement.value = value;

        // Create and dispatch the input event
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);

        // Create and dispatch the change event
        const changeEvent = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(changeEvent);
    }
};
