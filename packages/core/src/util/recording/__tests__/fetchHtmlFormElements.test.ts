
import { fetchHtmlFormElements } from '../fetchHtmlFormElements';

describe('fetchHtmlFormElements', () => {
  it('should fetch html form elements', () => {
    const elements = fetchHtmlFormElements();
    expect(elements).toBeDefined();
  });
});
