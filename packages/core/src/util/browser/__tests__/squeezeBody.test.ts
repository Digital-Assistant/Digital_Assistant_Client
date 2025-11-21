
import { squeezeBody } from '../squeezeBody';

// Mock the node utilities module in a Jest-supported way instead of spying on
// an ESM namespace export (which is non-configurable and causes redefine errors)
jest.mock('../../node', () => ({
  ...jest.requireActual('../../node'),
  initSpecialNodes: jest.fn().mockResolvedValue(undefined),
}));
import { initSpecialNodes } from '../../node';

// Mock the entire store module to prevent Redux initialization errors
jest.mock('../../../store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      // Provide a minimal state structure if any part of the code tries to access it
      recording: {},
      editing: {},
      validation: {},
      user: {},
      flow: {},
    })),
    subscribe: jest.fn(),
  },
  // Mock any other exports from the store module if they are used
}));


describe('squeezeBody', () => {

  beforeEach(() => {
    // Reset the spy before each test
    (initSpecialNodes as jest.Mock).mockClear();
    // Set default for window.UDAGlobalConfig
    (window as any).UDAGlobalConfig = { enableOverlay: false };
    // Reset body style
    document.body.style.maxWidth = '';
    document.body.style.minWidth = '';
    document.body.style.float = '';
  });

  it('should call initSpecialNodes', async () => {
    await squeezeBody(true);
    expect(initSpecialNodes).toHaveBeenCalledTimes(1);
  });

  it('should set body styles for squeezing when hide is false', async () => {
    await squeezeBody(false);
    expect(document.body.style.maxWidth).toBe('77%');
    expect(document.body.style.minWidth).toBe('77%');
    expect(document.body.style.float).toBe('left');
  });

  it('should reset body styles for unsqueezing when hide is true', async () => {
    // First squeeze it
    await squeezeBody(false);
    // Then unsqueeze it
    await squeezeBody(true);
    expect(document.body.style.maxWidth).toBe('100%');
    expect(document.body.style.minWidth).toBe('100%');
    expect(document.body.style.float).toBe('none');
  });

  it('should not change body styles if enableOverlay is true', async () => {
    (window as any).UDAGlobalConfig = { enableOverlay: true };
    await squeezeBody(false);
    expect(document.body.style.maxWidth).toBe('');
    expect(document.body.style.minWidth).toBe('');
    expect(document.body.style.float).toBe('');
  });

  it('should still not change body styles if enableOverlay is true and hide is true', async () => {
    (window as any).UDAGlobalConfig = { enableOverlay: true };
    await squeezeBody(true);
    expect(document.body.style.maxWidth).toBe('');
    expect(document.body.style.minWidth).toBe('');
    expect(document.body.style.float).toBe('');
  });

  it('should override existing styles and then reset them', async () => {
    document.body.style.maxWidth = '50%';
    document.body.style.minWidth = '50%';
    document.body.style.float = 'right';

    await squeezeBody(false);
    expect(document.body.style.maxWidth).toBe('77%');
    expect(document.body.style.minWidth).toBe('77%');
    expect(document.body.style.float).toBe('left');

    await squeezeBody(true);
    expect(document.body.style.maxWidth).toBe('100%');
    expect(document.body.style.minWidth).toBe('100%');
    expect(document.body.style.float).toBe('none');
  });
});
