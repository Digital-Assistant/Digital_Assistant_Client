
import { isClickableNode } from '../isClickableNode';
import * as CheckNodeValuesModule from '../checkNodeValues';

describe('isClickableNode', () => {
  let checkNodeValuesSpy: jest.SpyInstance;

  beforeEach(() => {
    checkNodeValuesSpy = jest.spyOn(CheckNodeValuesModule, 'checkNodeValues').mockReturnValue(false);
    window.UDAClickObjects = [];
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true for an element with a pointer cursor', () => {
    const element = document.createElement('div');
    element.style.cursor = 'pointer';
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(true);
  });

  it('should return false for an element without a pointer cursor', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(false);
  });

  it('should return true if the element is in UDAClickObjects', () => {
    const element = document.createElement('div');
    window.UDAClickObjects = [{ element }];
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(true);
  });

  it('should return true if checkNodeValues returns true for "include"', () => {
    const element = document.createElement('div');
    checkNodeValuesSpy.mockImplementation((node, value) => value === 'include');
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(true);
  });

  it('should return false if the element is inside #udan-react-root', () => {
    const root = document.createElement('div');
    root.id = 'udan-react-root';
    const element = document.createElement('div');
    root.appendChild(element);
    document.body.appendChild(root);
    expect(isClickableNode(element)).toBe(false);
  });

  it('should return false if a parent has [udaIgnoreChildren]', () => {
    const parent = document.createElement('div');
    parent.setAttribute('udaIgnoreChildren', '');
    const element = document.createElement('div');
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(isClickableNode(element)).toBe(false);
  });

  it('should set [udaIgnoreChildren] and return true if checkNodeValues returns true for "ignoreChildren"', () => {
    const element = document.createElement('div');
    checkNodeValuesSpy.mockImplementation((node, value) => value === 'ignoreChildren');
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(true);
    expect(element.hasAttribute('udaIgnoreChildren')).toBe(true);
  });

  it('should set [udaIgnoreClick] and return false if checkNodeValues returns true for "ignoreClicksOnNodes"', () => {
    const element = document.createElement('div');
    element.style.cursor = 'pointer'; // Make it clickable initially
    checkNodeValuesSpy.mockImplementation((node, value) => value === 'ignoreClicksOnNodes');
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(false);
    expect(element.hasAttribute('udaIgnoreClick')).toBe(true);
  });

  it('should return false if checkNodeValues returns true for "exclude"', () => {
    const element = document.createElement('div');
    element.style.cursor = 'pointer'; // Make it clickable initially
    checkNodeValuesSpy.mockImplementation((node, value) => value === 'exclude');
    document.body.appendChild(element);
    expect(isClickableNode(element)).toBe(false);
  });
});
