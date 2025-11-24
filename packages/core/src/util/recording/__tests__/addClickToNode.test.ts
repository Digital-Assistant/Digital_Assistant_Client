
// Import the function to be tested
import { addClickToNode } from '../addClickToNode';

// Mock dependencies
import { addEvent } from '../addEvent';
import { UDAErrorLogger } from '../../error/error-log';

jest.mock('../addEvent');
jest.mock('../../error/error-log', () => ({
  UDAErrorLogger: {
    error: jest.fn(),
  },
}));

describe('addClickToNode', () => {
  let node: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create a fresh element for each test
    node = document.createElement('button');
  });

  it('should not add an event if the node has the "uda_exclude" class', () => {
    node.classList.add('uda_exclude');
    addClickToNode(node);
    expect(addEvent).not.toHaveBeenCalled();
  });

  it('should not add an event if the node already has addedClickRecord set to true', () => {
    node.addedClickRecord = true;
    addClickToNode(node);
    expect(addEvent).not.toHaveBeenCalled();
  });

  it('should add a "focus" event for select2-selection elements', () => {
    node = document.createElement('span');
    node.classList.add('select2-selection');
    addClickToNode(node);
    expect(addEvent).toHaveBeenCalledWith(node, 'focus');
    expect(node.addedClickRecord).toBe(true);
  });

  // Test various standard HTML elements
  const standardClickElements = ['a', 'select', 'textarea', 'button', 'tr'];
  standardClickElements.forEach(tagName => {
    it(`should add a "click" event to a <${tagName}> element`, () => {
      node = document.createElement(tagName);
      addClickToNode(node);
      expect(addEvent).toHaveBeenCalledWith(node, 'click');
      expect(node.addedClickRecord).toBe(true);
    });
  });

  // Test various input types
  const inputTypes = [
    'email', 'text', 'button', 'color', 'date', 'datetime-local', 'file',
    'hidden', 'image', 'month', 'number', 'password', 'range', 'reset',
    'search', 'submit', 'tel', 'time', 'url', 'week', 'checkbox', 'radio'
  ];
  inputTypes.forEach(type => {
    it(`should add a "click" event to an <input type="${type}">`, () => {
      node = document.createElement('input');
      node.setAttribute('type', type);
      addClickToNode(node);
      expect(addEvent).toHaveBeenCalledWith(node, 'click');
      expect(node.addedClickRecord).toBe(true);
    });
  });

  it('should add a "click" event to an <input> with no type attribute', () => {
    node = document.createElement('input');
    addClickToNode(node);
    expect(addEvent).toHaveBeenCalledWith(node, 'click');
    expect(node.addedClickRecord).toBe(true);
  });

  it('should add a "click" event to a custom "mat-select" element', () => {
    node = document.createElement('mat-select');
    addClickToNode(node);
    expect(addEvent).toHaveBeenCalledWith(node, 'click');
    expect(node.addedClickRecord).toBe(true);
  });

  it('should add a "click" event to a generic <div> as a default case', () => {
    node = document.createElement('div');
    addClickToNode(node);
    expect(addEvent).toHaveBeenCalledWith(node, 'click');
    expect(node.addedClickRecord).toBe(true);
  });

  it('should log an error if an exception occurs', () => {
    const error = new Error('Test error');
    // Make the node invalid to cause an error
    const invalidNode = {
      classList: {
        contains: () => { throw error; }
      }
    };

    addClickToNode(invalidNode);

    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Unable to add click to node"),
      error
    );
  });

  it('should return the node after adding the event', () => {
    const result = addClickToNode(node);
    expect(result).toBe(node);
  });

  it('should return undefined if the node is excluded', () => {
    node.classList.add('uda_exclude');
    const result = addClickToNode(node);
    expect(result).toBeUndefined();
  });
});
