
import { getDirectInnerText } from '../getDirectInnerText';

describe('getDirectInnerText', () => {
  it('should get direct inner text', () => {
    const element = document.createElement('div');
    element.innerText = 'test';
    const text = getDirectInnerText(element);
    expect(text).toBe('test');
  });
});
