
import { mapClickedElementToHtmlFormElement } from '../mapClickedElementToHtmlFormElement';

describe('mapClickedElementToHtmlFormElement', () => {
  it('should map clicked element to html form element', () => {
    const element = document.createElement('div');
    const result = mapClickedElementToHtmlFormElement(element);
    expect(result).toBeDefined();
  });
});
