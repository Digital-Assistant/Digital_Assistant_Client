
import { getAbsoluteOffsets } from '../getAbsoluteOffsets';

describe('getAbsoluteOffsets', () => {
  it('should get absolute offsets', () => {
    const element = document.createElement('div');
    const offsets = getAbsoluteOffsets(element);
    expect(offsets).toBeDefined();
  });
});
