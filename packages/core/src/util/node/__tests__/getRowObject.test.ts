
import { getRowObject } from '../getRowObject';

describe('getRowObject', () => {
  it('should get row object', () => {
    const element = document.createElement('div');
    const obj = getRowObject(element);
    expect(obj).toBeDefined();
  });
});
