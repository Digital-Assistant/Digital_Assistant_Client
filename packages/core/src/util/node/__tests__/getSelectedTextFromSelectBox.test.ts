
import { getSelectedTextFromSelectBox } from '../getSelectedTextFromSelectBox';

describe('getSelectedTextFromSelectBox', () => {
  it('should get selected text from select box', () => {
    const element = document.createElement('select');
    const option = document.createElement('option');
    option.text = 'test';
    option.selected = true;
    element.appendChild(option);
    const text = getSelectedTextFromSelectBox(element);
    expect(text).toBe('test');
  });
});
