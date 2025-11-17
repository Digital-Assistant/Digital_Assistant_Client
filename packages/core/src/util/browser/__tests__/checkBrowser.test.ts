
import { checkBrowser } from '../checkBrowser';

describe('checkBrowser', () => {
  it('should check browser', () => {
    const result = checkBrowser();
    expect(result).toBeDefined();
  });
});
