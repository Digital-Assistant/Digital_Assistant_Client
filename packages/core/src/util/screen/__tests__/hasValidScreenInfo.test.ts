
import { hasValidScreenInfo } from '../hasValidScreenInfo';

describe('hasValidScreenInfo', () => {
  it('should return true if screen info is valid', () => {
    const result = hasValidScreenInfo(document.getElementById('uda'));
    expect(result).toBe(true);
  });
});
