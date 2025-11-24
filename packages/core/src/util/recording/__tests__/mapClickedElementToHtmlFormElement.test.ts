
// Import the function to be tested
import { mapClickedElementToHtmlFormElement } from '../mapClickedElementToHtmlFormElement';
import defaultExport from '../mapClickedElementToHtmlFormElement';
import { fetchHtmlFormElements } from '../fetchHtmlFormElements';

// Mock the dependency
jest.mock('../fetchHtmlFormElements');

describe('mapClickedElementToHtmlFormElement', () => {
  let mockElements: any[];

  beforeEach(() => {
    // Reset mocks and provide fresh mock data for each test
    jest.clearAllMocks();
    mockElements = [
      { inputElement: 'input', inputType: 'text', systemTag: 'text' },
      { inputElement: 'input', inputType: 'checkbox', systemTag: 'multipleChoice' },
      { inputElement: 'input', inputType: ['date', 'time'], systemTag: 'date' },
      { inputElement: ['select', 'option'], inputType: 'select', systemTag: 'dropDown' },
      { inputElement: 'button', inputType: 'submit', systemTag: 'button' },
      { inputElement: 'a', inputType: 'href', systemTag: 'link' },
      { inputElement: 'others', inputType: 'others', systemTag: 'others' },
    ];
    (fetchHtmlFormElements as jest.Mock).mockReturnValue(mockElements);
  });

  it('should return the same data for both named and default exports', () => {
    const node = document.createElement('div');
    const namedExportResult = mapClickedElementToHtmlFormElement(node);
    const defaultExportResult = defaultExport(node);
    expect(namedExportResult).toEqual(defaultExportResult);
  });

  it('should map a standard text input element', () => {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');
    const result = mapClickedElementToHtmlFormElement(node);
    expect(result.systemTag).toBe('text');
  });

  it('should map an input with a type from an array (e.g., date)', () => {
    const node = document.createElement('input');
    node.setAttribute('type', 'date');
    const result = mapClickedElementToHtmlFormElement(node);
    expect(result.systemTag).toBe('date');
  });

  it('should map an element where inputElement is an array (e.g., select)', () => {
    const node = document.createElement('select');
    const result = mapClickedElementToHtmlFormElement(node);
    expect(result.systemTag).toBe('dropDown');
  });

  it('should map a link (<a>) element', () => {
    const node = document.createElement('a');
    const result = mapClickedElementToHtmlFormElement(node);
    expect(result.systemTag).toBe('link');
  });

  it('should return the "others" type for an unrecognized element', () => {
    const node = document.createElement('div'); // A generic div
    const result = mapClickedElementToHtmlFormElement(node);
    expect(result.systemTag).toBe('others');
  });

  it('should be case-insensitive to nodeName', () => {
    // JSDOM creates uppercase node names, so we create a mock node with lowercase
    const mockNode = {
      nodeName: 'a',
      hasAttribute: () => false,
      getAttribute: () => '',
    };
    const result = mapClickedElementToHtmlFormElement(mockNode);
    expect(result.systemTag).toBe('link');
  });

  it('should handle nodes without a "type" attribute gracefully', () => {
    const node = document.createElement('input'); // Input with no type
    const result = mapClickedElementToHtmlFormElement(node);
    // The current logic falls through to 'others' if type doesn't match
    expect(result.systemTag).toBe('others');
  });

  it('should not fail if fetchHtmlFormElements returns an empty array', () => {
    (fetchHtmlFormElements as jest.Mock).mockReturnValue([]);
    const node = document.createElement('button');
    const result = mapClickedElementToHtmlFormElement(node);
    // Should return the default 'others' object
    expect(result.systemTag).toBe('others');
  });
});
