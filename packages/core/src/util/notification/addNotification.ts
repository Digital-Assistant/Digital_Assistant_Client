import Swal from 'sweetalert2';

/**
 * Displays a notification with a given title, description, status, and placement.
 * This implementation uses sweetalert2 to be UI-framework-agnostic and support shadow DOM.
 *
 * IMPORTANT: For the notification to be styled correctly, you must inject the sweetalert2
 * CSS into the shadow DOM where the notification will be rendered. You can do this by
 * adding a <link> tag to your shadow root:
 *
 * const link = document.createElement('link');
 * link.rel = 'stylesheet';
 * link.href = 'node_modules/sweetalert2/dist/sweetalert2.min.css';
 * shadowRoot.appendChild(link);
 *
 * @param title The title of the notification.
 * @param description The main content of the notification.
 * @param status The type of notification (e.g., 'info', 'success', 'warning', 'error').
 * @param placement The position where the notification should appear on the screen.
 */
export const addNotification = (title = '', description = '', status = 'info', placement = 'top-end') => {
    const getContainer = () => {
        // @ts-ignore
        const shadowRoot = document.getElementById('udan-react-root')?.shadowRoot;
        if (shadowRoot) {
            let container = shadowRoot.querySelector('.udan-notification-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'udan-notification-container';
                shadowRoot.appendChild(container);
            }
            return container as HTMLElement;
        }
        return document.body;
    };

    const target = getContainer();

    const Toast = Swal.mixin({
        toast: true,
        position: placement as any,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        target: target,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: status as any,
        title: title,
        html: description,
    });
};
