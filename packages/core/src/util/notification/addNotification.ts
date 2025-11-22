// This module provides a function to display notifications.
// It appears to be a wrapper around a notification library, possibly Ant Design,
// though the actual notification call is currently commented out.

/**
 * Displays a notification with a given title, description, status, and placement.
 * The notification is rendered within the shadow DOM of the 'udan-react-root' element
 * to ensure it is properly encapsulated.
 *
 * @param title The title of the notification.
 * @param description The main content of the notification.
 * @param status The type of notification (e.g., 'info', 'success', 'warning', 'error').
 * @param placement The position where the notification should appear on the screen.
 */
export const addNotification = (title = '', description = '', status = 'info', placement='top') => {
    const args: any = {
        message: title,
        description: description,
        placement: placement,
        // This function ensures that the notification is rendered inside the shadow DOM
        // of the 'udan-react-root' element, which is good for style encapsulation.
        getContainer: () => {
            // @ts-ignore
            return document.getElementById('udan-react-root').shadowRoot;
        }
    };
    // The actual call to the notification library is commented out.
    // To enable notifications, this line would need to be uncommented and the
    // `notification` object from the library (e.g., Ant Design) would need to be imported.
    // @ts-ignore
    // notification[status](args);
}
