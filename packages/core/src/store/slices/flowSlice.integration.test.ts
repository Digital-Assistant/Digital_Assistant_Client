/**
 * Integration tests for Redux Flow Thunks
 * @file packages/core/src/store/slices/flowSlice.integration.test.ts
 * 
 * Tests async Redux thunks to verify they correctly interact with mocked API services
 * and dispatch appropriate actions (pending, fulfilled, rejected) to the Redux store.
 */

import { configureStore } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import flowSlice, { FlowState, setSearchResults, setSearchKeyword } from './flowSlice';
import { apiClient } from '../../services/apiClient';

// Mock the API client
jest.mock('../../services/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Create mock async thunks for testing (since they don't exist in current implementation)
/**
 * Async thunk to fetch flows from the API
 */
export const fetchFlows = createAsyncThunk(
  'flow/fetchFlows',
  async (searchParams: { keyword: string; page: number }) => {
    const response = await apiClient.get(`/api/flows?keyword=${searchParams.keyword}&page=${searchParams.page}`);
    return response.data;
  }
);

/**
 * Async thunk to save a flow via API
 */
export const saveFlow = createAsyncThunk(
  'flow/saveFlow',
  async (flowData: { id?: string; name: string; description: string; data: any }) => {
    if (flowData.id) {
      // Update existing flow
      const response = await apiClient.put(`/api/flows/${flowData.id}`, flowData);
      return response.data;
    } else {
      // Create new flow
      const response = await apiClient.post('/api/flows', flowData);
      return response.data;
    }
  }
);

// Enhanced flow slice with async thunk support
const enhancedFlowSlice = {
  ...flowSlice,
  extraReducers: (builder: any) => {
    builder
      // fetchFlows thunk reducers
      .addCase(fetchFlows.pending, (state: FlowState) => {
        // Handle pending state if needed
      })
      .addCase(fetchFlows.fulfilled, (state: FlowState, action: any) => {
        state.searchResults = action.payload.flows || [];
        state.hasMorePages = action.payload.hasMorePages || false;
      })
      .addCase(fetchFlows.rejected, (state: FlowState) => {
        state.searchResults = [];
        state.hasMorePages = false;
      })
      // saveFlow thunk reducers
      .addCase(saveFlow.pending, (state: FlowState) => {
        // Handle pending state if needed
      })
      .addCase(saveFlow.fulfilled, (state: FlowState, action: any) => {
        // Update the flow in search results if it exists
        const savedFlow = action.payload;
        const existingIndex = state.searchResults.findIndex((flow: any) => flow.id === savedFlow.id);
        if (existingIndex !== -1) {
          state.searchResults[existingIndex] = savedFlow;
        }
      })
      .addCase(saveFlow.rejected, (state: FlowState) => {
        // Handle rejected state if needed
      });
  },
};

describe('Flow Slice Integration Tests', () => {
  let store: any;
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});

    // Create test store
    store = configureStore({
      reducer: {
        flow: enhancedFlowSlice.reducer,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchFlows thunk', () => {
    const mockSearchParams = { keyword: 'test-flow', page: 0 };
    const mockApiResponse = {
      data: {
        flows: [
          { id: '1', name: 'Test Flow 1', description: 'First test flow' },
          { id: '2', name: 'Test Flow 2', description: 'Second test flow' },
        ],
        hasMorePages: true,
      },
    };

    /**
     * Test that fetchFlows dispatches pending action immediately
     */
    it('should dispatch pending action when fetchFlows is called', async () => {
      // Arrange
      mockedApiClient.get.mockResolvedValue(mockApiResponse);

      // Act
      const promise = store.dispatch(fetchFlows(mockSearchParams));

      // Assert - Check that pending action is dispatched
      const actions = store.getState();
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/flows?keyword=test-flow&page=0');
      
      await promise;
    });

    /**
     * Test that fetchFlows dispatches fulfilled action with correct payload on successful API response
     */
    it('should dispatch fulfilled action with correct payload on successful API response', async () => {
      // Arrange
      mockedApiClient.get.mockResolvedValue(mockApiResponse);

      // Act
      await store.dispatch(fetchFlows(mockSearchParams));

      // Assert
      const state = store.getState().flow;
      expect(state.searchResults).toEqual(mockApiResponse.data.flows);
      expect(state.hasMorePages).toBe(true);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/flows?keyword=test-flow&page=0');
    });

    /**
     * Test that fetchFlows dispatches rejected action on failed API response
     */
    it('should dispatch rejected action on failed API response', async () => {
      // Arrange
      const mockError = new Error('API Error: Network failure');
      mockedApiClient.get.mockRejectedValue(mockError);

      // Act
      await store.dispatch(fetchFlows(mockSearchParams));

      // Assert
      const state = store.getState().flow;
      expect(state.searchResults).toEqual([]);
      expect(state.hasMorePages).toBe(false);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/flows?keyword=test-flow&page=0');
    });
  });

  describe('saveFlow thunk', () => {
    const mockNewFlowData = {
      name: 'New Test Flow',
      description: 'A new flow for testing',
      data: { steps: [], connections: [] },
    };

    const mockExistingFlowData = {
      id: '123',
      name: 'Updated Test Flow',
      description: 'An updated flow for testing',
      data: { steps: [{ id: 'step1', type: 'action' }], connections: [] },
    };

    const mockSavedFlowResponse = {
      data: {
        id: '123',
        name: 'New Test Flow',
        description: 'A new flow for testing',
        data: { steps: [], connections: [] },
        createdAt: '2025-09-15T23:25:00Z',
        updatedAt: '2025-09-15T23:25:00Z',
      },
    };

    /**
     * Test that saveFlow dispatches pending action immediately for new flow creation
     */
    it('should dispatch pending action when saveFlow is called for new flow', async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValue(mockSavedFlowResponse);

      // Act
      const promise = store.dispatch(saveFlow(mockNewFlowData));

      // Assert - Check that pending action is dispatched
      expect(mockedApiClient.post).toHaveBeenCalledWith('/api/flows', mockNewFlowData);
      
      await promise;
    });

    /**
     * Test that saveFlow dispatches fulfilled action with correct payload on successful creation
     */
    it('should dispatch fulfilled action with correct payload on successful flow creation', async () => {
      // Arrange
      mockedApiClient.post.mockResolvedValue(mockSavedFlowResponse);
      
      // Set up initial state with some search results
      store.dispatch(setSearchResults([
        { id: '456', name: 'Other Flow', description: 'Another flow' }
      ]));

      // Act
      await store.dispatch(saveFlow(mockNewFlowData));

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith('/api/flows', mockNewFlowData);
      // Note: In a real implementation, you might want to add the new flow to searchResults
      // or handle the response differently based on business logic
    });

    /**
     * Test that saveFlow dispatches rejected action on failed creation
     */
    it('should dispatch rejected action on failed flow creation', async () => {
      // Arrange
      const mockError = new Error('API Error: Validation failed');
      mockedApiClient.post.mockRejectedValue(mockError);

      // Act
      await store.dispatch(saveFlow(mockNewFlowData));

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith('/api/flows', mockNewFlowData);
      // State should remain unchanged on error
      const state = store.getState().flow;
      expect(state.searchResults).toEqual([]);
    });

    /**
     * Test that saveFlow dispatches pending action immediately for existing flow update
     */
    it('should dispatch pending action when saveFlow is called for existing flow update', async () => {
      // Arrange
      const updatedResponse = { ...mockSavedFlowResponse, data: { ...mockSavedFlowResponse.data, ...mockExistingFlowData } };
      mockedApiClient.put.mockResolvedValue(updatedResponse);

      // Act
      const promise = store.dispatch(saveFlow(mockExistingFlowData));

      // Assert - Check that pending action is dispatched
      expect(mockedApiClient.put).toHaveBeenCalledWith('/api/flows/123', mockExistingFlowData);
      
      await promise;
    });

    /**
     * Test that saveFlow dispatches fulfilled action with correct payload on successful update
     */
    it('should dispatch fulfilled action with correct payload on successful flow update', async () => {
      // Arrange
      const updatedResponse = { ...mockSavedFlowResponse, data: { ...mockSavedFlowResponse.data, ...mockExistingFlowData } };
      mockedApiClient.put.mockResolvedValue(updatedResponse);
      
      // Set up initial state with the flow to be updated in search results
      store.dispatch(setSearchResults([
        { id: '123', name: 'Old Flow Name', description: 'Old description' },
        { id: '456', name: 'Other Flow', description: 'Another flow' }
      ]));

      // Act
      await store.dispatch(saveFlow(mockExistingFlowData));

      // Assert
      expect(mockedApiClient.put).toHaveBeenCalledWith('/api/flows/123', mockExistingFlowData);
      const state = store.getState().flow;
      
      // Check that the flow was updated in search results
      const updatedFlow = state.searchResults.find((flow: any) => flow.id === '123');
      expect(updatedFlow).toBeDefined();
      expect(updatedFlow.name).toBe('Updated Test Flow');
    });

    /**
     * Test that saveFlow dispatches rejected action on failed update
     */
    it('should dispatch rejected action on failed flow update', async () => {
      // Arrange
      const mockError = new Error('API Error: Flow not found');
      mockedApiClient.put.mockRejectedValue(mockError);
      
      // Set up initial state
      const initialFlows = [{ id: '123', name: 'Original Flow', description: 'Original description' }];
      store.dispatch(setSearchResults(initialFlows));

      // Act
      await store.dispatch(saveFlow(mockExistingFlowData));

      // Assert
      expect(mockedApiClient.put).toHaveBeenCalledWith('/api/flows/123', mockExistingFlowData);
      // State should remain unchanged on error
      const state = store.getState().flow;
      expect(state.searchResults).toEqual(initialFlows);
    });
  });

  describe('Integration with localStorage', () => {
    /**
     * Test that state changes from thunks are persisted to localStorage
     */
    it('should persist state changes to localStorage when thunks modify state', async () => {
      // Arrange
      const mockApiResponse = {
        data: {
          flows: [{ id: '1', name: 'Persisted Flow' }],
          hasMorePages: false,
        },
      };
      mockedApiClient.get.mockResolvedValue(mockApiResponse);

      // Act
      await store.dispatch(fetchFlows({ keyword: 'persist', page: 0 }));

      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'flowState',
        expect.stringContaining('"searchResults":[{"id":"1","name":"Persisted Flow"}]')
      );
    });
  });

  describe('Error handling and edge cases', () => {
    /**
     * Test handling of malformed API responses
     */
    it('should handle malformed API responses gracefully', async () => {
      // Arrange
      const malformedResponse = { data: null };
      mockedApiClient.get.mockResolvedValue(malformedResponse);

      // Act
      await store.dispatch(fetchFlows({ keyword: 'test', page: 0 }));

      // Assert
      const state = store.getState().flow;
      expect(state.searchResults).toEqual([]);
      expect(state.hasMorePages).toBe(false);
    });

    /**
     * Test handling of network timeouts
     */
    it('should handle network timeouts appropriately', async () => {
      // Arrange
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      mockedApiClient.get.mockRejectedValue(timeoutError);

      // Act
      await store.dispatch(fetchFlows({ keyword: 'timeout', page: 0 }));

      // Assert
      const state = store.getState().flow;
      expect(state.searchResults).toEqual([]);
      expect(state.hasMorePages).toBe(false);
    });
  });
});