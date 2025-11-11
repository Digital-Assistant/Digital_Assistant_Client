import { domService } from '../services/domService';

/**
 * Wrapper to compute absolute offsets of an element (page-relative x/y).
 * Delegates to domService.getAbsoluteOffsets to keep parity with original UI util.
 */
export const getAbsoluteOffsets = (element: HTMLElement): { x: number; y: number } => {
  return domService.getAbsoluteOffsets(element);
};
