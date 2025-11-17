
import { getTab } from '../getTab';

describe('getTab', () => {
  it('should get tab', () => {
    const tab = getTab();
    expect(tab).toBeDefined();
  });
});
