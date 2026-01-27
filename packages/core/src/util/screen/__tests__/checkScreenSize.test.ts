
// Mock dependencies
jest.mock('../getScreenSize', () => ({
  getScreenSize: jest.fn(),
}));
jest.mock('../../error/error-log', () => ({
  UDAConsoleLogger: {
    info: jest.fn(),
  },
  UDAErrorLogger: {
    error: jest.fn(),
  },
}));

import { checkScreenSize } from '../checkScreenSize';
import { getScreenSize } from '../getScreenSize';
import { UDAErrorLogger } from '../../error/error-log';

describe('checkScreenSize', () => {
  const originalWindow = global.window;

  // Helper to mock window properties
  const mockWindow = (width: any, height: any, devicePixelRatio: number) => {
    Object.defineProperty(global, 'window', {
      value: {
        devicePixelRatio: devicePixelRatio,
      },
      writable: true,
    });
    (getScreenSize as jest.Mock).mockReturnValue({
      screen: { width, height },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Restore the original window object before each test
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
    });
  });

  it('should enable plugin and not show alert for optimal resolution', () => {
    mockWindow(1920, 1080, 1);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: true, showScreenAlert: false });
  });

  it('should enable plugin and show alert for resolution below optimal but above minimum', () => {
    mockWindow(1300, 800, 1);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: true, showScreenAlert: true });
  });

  it('should disable plugin for resolution below minimum height', () => {
    mockWindow(1300, 700, 1);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
  });

  it('should disable plugin for resolution below minimum width', () => {
    mockWindow(1200, 800, 1);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
  });

  it('should handle high DPI displays correctly', () => {
    // Effective resolution: 1600x900 * 2 = 3200x1800 (Optimal)
    mockWindow(1600, 900, 2);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: true, showScreenAlert: false });
  });

  it('should return safe defaults and log error if window is not defined', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
    expect(UDAErrorLogger.error).toHaveBeenCalledWith('Screen size check failed: Window object is not available');
  });

  it('should return safe defaults for invalid screen size object', () => {
    (getScreenSize as jest.Mock).mockReturnValue(null);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
    expect(UDAErrorLogger.error).toHaveBeenCalledWith('Screen size check failed: Invalid screen size object');
  });

  it('should return safe defaults for invalid resolution values', () => {
    mockWindow(0, 0, 1); // Invalid resolution
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
    expect(UDAErrorLogger.error).toHaveBeenCalledWith('Screen size check failed: Invalid resolution values');
  });

  it('should return safe defaults for non-numeric resolution values', () => {
    mockWindow('invalid', '1080', 1);
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
    expect(UDAErrorLogger.error).toHaveBeenCalledWith('Screen size check failed: Invalid resolution values');
  });

  it('should return safe defaults for invalid device pixel ratio', () => {
    mockWindow(1920, 1080, 0); // Invalid device pixel ratio
    const result = checkScreenSize();
    expect(result).toEqual({ enablePluginForScreen: false, showScreenAlert: true });
    expect(UDAErrorLogger.error).toHaveBeenCalledWith('Screen size check failed: Invalid device pixel ratio');
  });
});
