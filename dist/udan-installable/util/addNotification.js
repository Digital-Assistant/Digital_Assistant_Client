import { notification } from "antd";
/**
 *
 * @param title
 * @param description
 * @param status
 * @param placement
 */
export const addNotification = (title = '', description = '', status = 'info', placement = 'top') => {
    const args = {
        message: title,
        description: description,
        placement: placement,
        getContainer: () => {
            return document.getElementById('udan-react-root').shadowRoot;
        }
    };
    notification[status](args);
};
