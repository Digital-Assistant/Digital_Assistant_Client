
import { checkNodeObjectKeyValue } from '../checkNodeObjectKeyValue';

describe('checkNodeObjectKeyValue', () => {
  it('should check node object key value', () => {
    const element = document.createElement('div');
    const result = checkNodeObjectKeyValue(element, 'test', ['test'], 'test');
    expect(result).toBeDefined();
  });
});
