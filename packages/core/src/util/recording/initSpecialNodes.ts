/* eslint-disable @typescript-eslint/no-explicit-any */
import { domService } from '../../services/domService';

/**
 * Initialize special nodes and mark ignorable elements within the UDA container.
 *
 * This wraps domService.initSpecialNodes() for convenient consumption from the SDK:
 *
 * import { initSpecialNodes } from '@digital-assistant/core';
 * await initSpecialNodes();
 */
export const initSpecialNodes = async (): Promise<void> => {
  await domService.initSpecialNodes();
};
