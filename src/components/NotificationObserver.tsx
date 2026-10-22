import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { coreSDK } from '../services/coreSDK';

/**
 * NotificationObserver component
 * Listens to the Core SDK's Redux state for notifications and displays them using sonner.
 */
export const NotificationObserver = () => {
    // Keep track of processed notification IDs to avoid duplicates
    const processedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        const unsubscribe = coreSDK.subscribe((state) => {
            const notifications = state.notification?.notifications || [];

            notifications.forEach((notification: any) => {
                if (!processedIds.current.has(notification.id)) {
                    processedIds.current.add(notification.id);

                    // Trigger sonner toast based on status
                    const toastOptions = {
                        description: notification.description,
                        duration: 4000,
                    };

                    switch (notification.status) {
                        case 'success':
                            toast.success(notification.title, toastOptions);
                            break;
                        case 'error':
                            toast.error(notification.title, toastOptions);
                            break;
                        case 'warning':
                            toast.warning(notification.title, toastOptions);
                            break;
                        default:
                            toast.info(notification.title, toastOptions);
                            break;
                    }
                }
            });

            // Cleanup old IDs if needed (optional, keeping it simple for now)
            if (processedIds.current.size > 100) {
                const idArray = Array.from(processedIds.current);
                processedIds.current = new Set(idArray.slice(-50));
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null; // This component doesn't render anything itself
};
