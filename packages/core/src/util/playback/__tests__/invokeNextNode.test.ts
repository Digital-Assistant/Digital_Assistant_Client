
// Import the function to be tested
import { invokeNextNode } from '../invokeNextNode';

// Mock dependencies
import { CONFIG } from '../../../config';
import { UDAConsoleLogger } from '../../error';
import { trigger } from '../../node';
import { removeToolTip } from '../../notification';

jest.mock('../../../config', () => ({
  CONFIG: {
    navigatedToNextPage: {
      check: false,
      url: '',
    },
  },
}));

jest.mock('../../error', () => ({
  UDAConsoleLogger: {
    info: jest.fn(),
  },
}));

jest.mock('../../node', () => ({
  trigger: jest.fn(),
}));

jest.mock('../../notification', () => ({
  removeToolTip: jest.fn(),
}));

// Use fake timers to control setTimeout
jest.useFakeTimers();

describe('invokeNextNode', () => {
  let node: HTMLElement;
  const timeToInvoke = 1000;

  beforeEach(() => {
    // Clear all mocks and timers before each test to ensure isolation
    jest.clearAllMocks();
    jest.clearAllTimers();
    CONFIG.navigatedToNextPage = { check: false, url: '' };
    
    // Create a mock DOM element with a click method
    node = document.createElement('button');
    node.click = jest.fn();

    // Reset window.location mock for each test
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        host: 'localhost',
        pathname: '/',
      },
      writable: true,
    });
  });

  it('should invoke click and remove tooltip after the specified delay', () => {
    invokeNextNode(node, timeToInvoke);

    expect(node.click).not.toHaveBeenCalled();
    expect(removeToolTip).not.toHaveBeenCalled();

    // Fast-forward time by the initial delay
    jest.advanceTimersByTime(timeToInvoke);

    expect(node.click).toHaveBeenCalledTimes(1);
    expect(removeToolTip).toHaveBeenCalledTimes(1);
  });

  it('should trigger "UDAPlayNext" for a non-link node', () => {
    invokeNextNode(node, timeToInvoke);

    // Run all scheduled timers to completion
    jest.runAllTimers();

    expect(UDAConsoleLogger.info).toHaveBeenCalledWith(node, 2);
    expect(trigger).toHaveBeenCalledWith('UDAPlayNext', { playNext: true });
    expect(trigger).toHaveBeenCalledTimes(1);
  });

  it('should handle anchor tags that navigate to a new page', () => {
    const anchor = document.createElement('a');
    anchor.href = 'http://localhost/new-page';
    anchor.click = jest.fn();

    invokeNextNode(anchor, timeToInvoke);

    jest.runAllTimers();

    expect(CONFIG.navigatedToNextPage.check).toBe(true);
    expect(CONFIG.navigatedToNextPage.url).toBe(anchor.href);
    
    expect(trigger).toHaveBeenCalledWith('UDAPlayNext', { playNext: true });
    expect(UDAConsoleLogger.info).not.toHaveBeenCalled();
  });

  it('should not set navigation flag for non-navigational links (e.g., hash links)', () => {
    const anchor = document.createElement('a');
    anchor.href = '#section';
    anchor.click = jest.fn();

    invokeNextNode(anchor, timeToInvoke);
    jest.runAllTimers();

    expect(CONFIG.navigatedToNextPage.check).toBe(false);
    expect(CONFIG.navigatedToNextPage.url).toBe('');
    expect(trigger).toHaveBeenCalledWith('UDAPlayNext', { playNext: true });
  });

  it('should handle links opening in a new tab without setting navigation flag', () => {
    const anchor = document.createElement('a');
    anchor.href = 'http://example.com/new-page';
    anchor.target = '_blank';
    anchor.click = jest.fn();

    invokeNextNode(anchor, timeToInvoke);
    jest.runAllTimers();

    expect(CONFIG.navigatedToNextPage.check).toBe(false);
    expect(trigger).toHaveBeenCalledWith('UDAPlayNext', { playNext: true });
  });
});
