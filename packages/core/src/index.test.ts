import { DigitalAssistantCore } from './index';
import { store } from './store';
import type { RootState } from './store';

// Mock the store
jest.mock('./store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

const mockStore = store as jest.Mocked<typeof store>;

describe('DigitalAssistantCore', () => {
  let sdkInstance: DigitalAssistantCore;
  
  beforeEach(() => {
    jest.clearAllMocks();
    sdkInstance = new DigitalAssistantCore();
    
    // Setup default mock return values
    mockStore.getState.mockReturnValue({
      recording: { isRecording: false },
      search: { query: '', results: [] },
    } as RootState);
  });

  describe('constructor', () => {
    it('should initialize without errors', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const instance = new DigitalAssistantCore();
      
      expect(instance).toBeInstanceOf(DigitalAssistantCore);
      expect(consoleSpy).toHaveBeenCalledWith('Digital Assistant SDK Core initialized');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getState', () => {
    it('should return the current state from the store', () => {
      const mockState = {
        recording: { isRecording: true },
        search: { query: 'test', results: [] },
      } as RootState;
      
      mockStore.getState.mockReturnValue(mockState);
      
      const result = sdkInstance.getState();
      
      expect(result).toBe(mockState);
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispatch', () => {
    it('should dispatch actions to the store', () => {
      const mockAction = { type: 'TEST_ACTION', payload: 'test' };
      mockStore.dispatch.mockReturnValue(mockAction);
      
      const result = sdkInstance.dispatch(mockAction);
      
      expect(result).toBe(mockAction);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to store changes and call callback with current state', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      const mockState = {
        recording: { isRecording: true },
        search: { query: 'test', results: [] },
      } as RootState;
      
      // Mock store.subscribe to capture the internal callback
      let internalCallback: () => void;
      mockStore.subscribe.mockImplementation((callback: () => void) => {
        internalCallback = callback;
        return mockUnsubscribe;
      });
      
      mockStore.getState.mockReturnValue(mockState);
      
      const unsubscribe = sdkInstance.subscribe(mockCallback);
      
      // Verify subscription was set up
      expect(mockStore.subscribe).toHaveBeenCalledTimes(1);
      expect(typeof unsubscribe).toBe('function');
      
      // Simulate a state change by calling the internal callback
      internalCallback!();
      
      // Verify callback was called with current state
      expect(mockCallback).toHaveBeenCalledWith(mockState);
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function that works correctly', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      mockStore.subscribe.mockReturnValue(mockUnsubscribe);
      
      const unsubscribe = sdkInstance.subscribe(mockCallback);
      
      // Call the returned unsubscribe function
      unsubscribe();
      
      // Verify the store's unsubscribe function was called
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscriptions independently', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      const mockUnsubscribe1 = jest.fn();
      const mockUnsubscribe2 = jest.fn();
      
      mockStore.subscribe
        .mockReturnValueOnce(mockUnsubscribe1)
        .mockReturnValueOnce(mockUnsubscribe2);
      
      const unsubscribe1 = sdkInstance.subscribe(mockCallback1);
      const unsubscribe2 = sdkInstance.subscribe(mockCallback2);
      
      expect(mockStore.subscribe).toHaveBeenCalledTimes(2);
      
      // Test that unsubscribe functions work independently
      unsubscribe1();
      expect(mockUnsubscribe1).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe2).not.toHaveBeenCalled();
      
      unsubscribe2();
      expect(mockUnsubscribe2).toHaveBeenCalledTimes(1);
    });
  });

  describe('unsubscribe', () => {
    it('should call stored unsubscribe callback if it exists', () => {
      const mockUnsubscribeCallback = jest.fn();
      
      // Set the private unsubscribeCallback property
      (sdkInstance as any).unsubscribeCallback = mockUnsubscribeCallback;
      
      sdkInstance.unsubscribe();
      
      expect(mockUnsubscribeCallback).toHaveBeenCalledTimes(1);
      expect((sdkInstance as any).unsubscribeCallback).toBeNull();
    });

    it('should do nothing if no unsubscribe callback exists', () => {
      // Ensure unsubscribeCallback is null
      (sdkInstance as any).unsubscribeCallback = null;
      
      // This should not throw or cause errors
      expect(() => sdkInstance.unsubscribe()).not.toThrow();
    });
  });

  describe('getSliceState', () => {
    it('should return specific slice state', () => {
      const mockState = {
        recording: { isRecording: true },
        search: { query: 'test', results: [] },
      } as RootState;
      
      mockStore.getState.mockReturnValue(mockState);
      
      const recordingState = sdkInstance.getSliceState('recording');
      const searchState = sdkInstance.getSliceState('search');
      
      expect(recordingState).toBe(mockState.recording);
      expect(searchState).toBe(mockState.search);
      expect(mockStore.getState).toHaveBeenCalledTimes(2);
    });
  });
});

// Test the default export instance
describe('Default DigitalAssistantCore instance', () => {
  it('should export a default instance', () => {
    const defaultInstance = require('./index').default;
    
    expect(defaultInstance).toBeInstanceOf(DigitalAssistantCore);
  });
});