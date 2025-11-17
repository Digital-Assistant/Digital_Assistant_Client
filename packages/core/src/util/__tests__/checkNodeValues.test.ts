
import { checkNodeValues } from '../checkNodeValues';

describe('checkNodeValues', () => {
  it('should check node values', () => {
    const element = document.createElement('div');
    const result = checkNodeValues(element, 'test');
    expect(result).toBeDefined();
  });
});
