import { domService } from '../services/domService';

/**
 * Fetches the effective domain for the current page.
 * Wrapper delegating to domService.fetchDomain to preserve original behavior.
 */
export const fetchDomain = (): string => {
  try {
    return domService.fetchDomain();
  } catch {
    return (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';
  }
};
