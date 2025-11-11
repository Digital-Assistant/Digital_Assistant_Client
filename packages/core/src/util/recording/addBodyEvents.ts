/* eslint-disable @typescript-eslint/no-explicit-any */
import { domService } from '../../services/domService';

/**
 * Add click-recording handlers to all clickable nodes in the current document body.
 *
 * This is a thin wrapper around domService.addBodyEvents() so consumers can
 * import a simple function from the SDK utilities:
 *
 * import { addBodyEvents } from '@digital-assistant/core';
 * await addBodyEvents();
 */
export const addBodyEvents = async (): Promise<void> => {
  await domService.addBodyEvents();
};
