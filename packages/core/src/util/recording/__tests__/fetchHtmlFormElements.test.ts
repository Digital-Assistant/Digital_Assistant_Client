
// Import the function to be tested
import { fetchHtmlFormElements } from '../fetchHtmlFormElements';
import defaultExport from '../fetchHtmlFormElements';

describe('fetchHtmlFormElements', () => {
  it('should return a non-empty array of element configurations', () => {
    const elements = fetchHtmlFormElements();
    expect(Array.isArray(elements)).toBe(true);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should return the same data for both named and default exports', () => {
    const namedExportResult = fetchHtmlFormElements();
    const defaultExportResult = defaultExport();
    expect(namedExportResult).toEqual(defaultExportResult);
  });

  it('should contain valid element configuration objects', () => {
    const elements = fetchHtmlFormElements();
    for (const el of elements) {
      expect(el).toHaveProperty('inputElement');
      expect(el).toHaveProperty('inputType');
      expect(el).toHaveProperty('displayName');
      expect(el).toHaveProperty('systemTag');
    }
  });

  it('should have a configuration for simple text inputs', () => {
    const elements = fetchHtmlFormElements();
    const textConfig = elements.find(el => el.systemTag === 'text');
    expect(textConfig).toBeDefined();
    expect(textConfig?.inputElement).toEqual('input');
    expect(textConfig?.inputType).toEqual(expect.arrayContaining(['text', 'search', 'url']));
  });

  it('should have a configuration for buttons', () => {
    const elements = fetchHtmlFormElements();
    const buttonConfig = elements.find(el => el.systemTag === 'button');
    expect(buttonConfig).toBeDefined();
    expect(buttonConfig?.inputElement).toEqual(expect.arrayContaining(['input', 'button']));
    expect(buttonConfig?.inputType).toEqual(expect.arrayContaining(['button', 'submit']));
  });

  it('should include a fallback "others" configuration', () => {
    const elements = fetchHtmlFormElements();
    const othersConfig = elements.find(el => el.systemTag === 'others');
    expect(othersConfig).toBeDefined();
    expect(othersConfig?.inputElement).toEqual('others');
  });

  it('should return a new array instance on each call', () => {
    const elements1 = fetchHtmlFormElements();
    const elements2 = fetchHtmlFormElements();
    // They should be deeply equal but not the same instance
    expect(elements1).toEqual(elements2);
    expect(elements1).not.toBe(elements2);
  });

  it('should not contain any undefined or null values in the configuration', () => {
    const elements = fetchHtmlFormElements();
    elements.forEach(el => {
      expect(el.inputElement).toBeDefined();
      expect(el.inputElement).not.toBeNull();
      expect(el.inputType).toBeDefined();
      expect(el.inputType).not.toBeNull();
      expect(el.displayName).toBeDefined();
      expect(el.displayName).not.toBeNull();
      expect(el.systemTag).toBeDefined();
      expect(el.systemTag).not.toBeNull();
    });
  });

  it('should match the expected data structure snapshot', () => {
    const elements = fetchHtmlFormElements();
    expect(elements).toMatchSnapshot();
  });
});
