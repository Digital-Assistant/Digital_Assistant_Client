
import { clickableElementExists } from '../clickableElementExists';

describe('clickableElementExists', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('button');
    document.body.appendChild(element);
    // @ts-ignore
    window.udanSelectedNodes = undefined;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return false if window.udanSelectedNodes is not defined', () => {
    expect(clickableElementExists(element)).toBe(false);
  });

  it('should return false if window.udanSelectedNodes is empty', () => {
    // @ts-ignore
    window.udanSelectedNodes = [];
    expect(clickableElementExists(element)).toBe(false);
  });

  it('should return true if window.udanSelectedNodes contains the element', () => {
    // @ts-ignore
    window.udanSelectedNodes = [element];
    expect(clickableElementExists(element)).toBe(true);
  });

  it('should return false if window.udanSelectedNodes does not contain the element', () => {
    const otherElement = document.createElement('div');
    // @ts-ignore
    window.udanSelectedNodes = [otherElement];
    expect(clickableElementExists(element)).toBe(false);
  });

  it('should return true if window.udanSelectedNodes contains the element among others', () => {
    const otherElement = document.createElement('div');
    // @ts-ignore
    window.udanSelectedNodes = [otherElement, element];
    expect(clickableElementExists(element)).toBe(true);
  });
});
