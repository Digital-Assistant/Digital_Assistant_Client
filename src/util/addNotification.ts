/**
 * addNotification
 *
 * Provides toast notifications for the UDAN-UI context (no shadow DOM).
 * Uses sonner (already a project dependency) instead of the core SDK's
 * sweetalert2 implementation, which requires a shadow DOM target that
 * does not exist in this app.
 *
 * The API is intentionally compatible with the core SDK's addNotification:
 *   addNotification(title, description, status, placement)
 */
import { toast } from "sonner";

export const addNotification = (
    title = '',
    description = '',
    status: 'success' | 'error' | 'info' | 'warning' = 'info',
    _placement = 'top-end'   // placement not used by sonner, kept for API compat
) => {
    const message = description || title;
    const messageTitle = description ? title : undefined;

    switch (status) {
        case 'success':
            toast.success(message, { description: messageTitle });
            break;
        case 'error':
            toast.error(message, { description: messageTitle });
            break;
        case 'warning':
            toast.warning(message, { description: messageTitle });
            break;
        default:
            toast.info(message, { description: messageTitle });
            break;
    }
};
