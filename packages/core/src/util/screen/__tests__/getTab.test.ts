
// Mock the browser utilities consumed by getTab to avoid real extension APIs
const queryMock = jest.fn();
const getMock = jest.fn();
let activeTabIdValue = -1; // Use a distinct name to avoid confusion with the mock function

jest.mock('../../browser', () => ({
  getBrowserVar: () => ({
    tabs: {
      query: queryMock,
      get: getMock,
    },
  }),
  getActiveTabId: () => activeTabIdValue, // Return the value from the variable
  getUDABrowserPlugin: () => false, // Mock this as it's not directly used but might be imported
}));

import { getTab } from '../getTab';

describe('getTab', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    activeTabIdValue = -1; // Reset for each test
    
    // Default mock implementations for successful scenarios
    queryMock.mockResolvedValue([{ id: 1, title: 'Tab1', url: 'http://example.com/tab1' }]);
    getMock.mockResolvedValue({ id: 2, title: 'Tab2', url: 'http://example.com/tab2' });

    // Spy on console.log and console.error to check for messages and suppress output
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore(); // Restore original console.log
    consoleErrorSpy.mockRestore(); // Restore original console.error
  });

  it('should return the first active tab from tabs.query if available', async () => {
    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).not.toHaveBeenCalled(); // Should not call get if query succeeds
    expect(tab).toEqual({ id: 1, title: 'Tab1', url: 'http://example.com/tab1' });
  });

  it('should fallback to tabs.get using activeTabId when query returns empty but activeTabId is valid', async () => {
    queryMock.mockResolvedValue([]); // Simulate query failing
    activeTabIdValue = 7; // Set a valid activeTabId
    getMock.mockResolvedValue({ id: 7, title: 'FromGet', url: 'http://example.com/fromget' }); // Mock get succeeding

    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).toHaveBeenCalledWith(7);
    expect(tab).toEqual({ id: 7, title: 'FromGet', url: 'http://example.com/fromget' });
  });

  it('should return false when query returns empty and activeTabId is -1', async () => {
    queryMock.mockResolvedValue([]); // Simulate query failing
    activeTabIdValue = -1; // Simulate no activeTabId
    getMock.mockResolvedValue(undefined); // Ensure getMock doesn't return anything if called

    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).not.toHaveBeenCalled(); // Should not call get if activeTabId is -1
    expect(tab).toBe(false);
    expect(consoleLogSpy).not.toHaveBeenCalledWith('No active tab identified.'); // Should not log if activeTabId is -1
  });

  it('should return false and log if query returns empty, activeTabId is valid, but tabs.get fails', async () => {
    queryMock.mockResolvedValue([]); // Simulate query failing
    activeTabIdValue = 99; // Set a valid activeTabId
    getMock.mockResolvedValue(undefined); // Simulate tabs.get failing to find the tab

    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).toHaveBeenCalledWith(99);
    expect(tab).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalledWith('No active tab identified.');
  });

  it('should handle errors from browser.tabs.query gracefully', async () => {
    const mockError = new Error('Query failed');
    queryMock.mockRejectedValue(mockError); // Simulate query throwing an error

    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).not.toHaveBeenCalled(); // Should not proceed to getMock
    expect(tab).toBe(false);
    // Depending on how the error is handled in getTab, it might log or just return false.
    // For now, we expect it to return false.
  });

  it('should handle errors from browser.tabs.get gracefully', async () => {
    queryMock.mockResolvedValue([]); // Query fails
    activeTabIdValue = 100; // Valid ID
    const mockError = new Error('Get failed');
    getMock.mockRejectedValue(mockError); // Simulate get throwing an error

    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(getMock).toHaveBeenCalledWith(100);
    expect(tab).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalledWith('No active tab identified.'); // The console.log is a fallback for get failing
  });
});
