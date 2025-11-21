// Mock the browser utilities consumed by getTab to avoid real extension APIs
const queryMock = jest.fn();
const getMock = jest.fn();
let activeTabId = -1;

jest.mock('../../browser', () => ({
  getBrowserVar: () => ({
    tabs: {
      query: queryMock,
      get: getMock,
    },
  }),
  getActiveTabId: () => activeTabId,
  getUDABrowserPlugin: () => false,
}));

import { getTab } from '../getTab';

describe('getTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activeTabId = -1;
    queryMock.mockResolvedValue([{ id: 1, title: 'Tab1' }]);
    getMock.mockResolvedValue({ id: 2, title: 'Tab2' });
  });

  it('should return the first active tab from tabs.query', async () => {
    const tab = await getTab();
    expect(queryMock).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(tab).toEqual({ id: 1, title: 'Tab1' });
  });

  it('should fallback to tabs.get using activeTabId when query returns empty', async () => {
    queryMock.mockResolvedValue([]);
    activeTabId = 7;
    getMock.mockResolvedValue({ id: 7, title: 'FromGet' });

    const tab = await getTab();
    expect(getMock).toHaveBeenCalledWith(7);
    expect(tab).toEqual({ id: 7, title: 'FromGet' });
  });

  it('should return false when no active tab can be determined', async () => {
    queryMock.mockResolvedValue([]);
    activeTabId = -1;

    const tab = await getTab();
    expect(tab).toBe(false);
  });
});
