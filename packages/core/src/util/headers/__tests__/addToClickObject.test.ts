
import { AddToClickObjects, ignoreTags } from '../addToClickObject';

describe('AddToClickObjects', () => {
  beforeEach(() => {
    // Reset the global array before each test
    window.UDAClickObjects = [];
  });

  it('should add a new element to UDAClickObjects', () => {
    const element = document.createElement('div');
    AddToClickObjects(element);
    expect(window.UDAClickObjects).toHaveLength(1);
    expect(window.UDAClickObjects[0].element).toBe(element);
    expect(window.UDAClickObjects[0].id).toBe(0);
  });

  it('should not add an element that is already in the array', () => {
    const element = document.createElement('div');
    AddToClickObjects(element);
    AddToClickObjects(element);
    expect(window.UDAClickObjects).toHaveLength(1);
  });

  it('should not add elements with ignored tags', () => {
    ignoreTags.forEach(tag => {
      const element = document.createElement(tag);
      AddToClickObjects(element);
    });
    expect(window.UDAClickObjects).toHaveLength(0);
  });

  it('should not add elements with the "uda_exclude" class', () => {
    const element = document.createElement('div');
    element.classList.add('uda_exclude');
    AddToClickObjects(element);
    expect(window.UDAClickObjects).toHaveLength(0);
  });

  it('should not add the window object', () => {
    AddToClickObjects(window);
    expect(window.UDAClickObjects).toHaveLength(0);
  });

  it('should not add an element without a tagName', () => {
    const element = {};
    AddToClickObjects(element);
    expect(window.UDAClickObjects).toHaveLength(0);
  });

  it('should assign incremental IDs', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    AddToClickObjects(element1);
    AddToClickObjects(element2);
    expect(window.UDAClickObjects[0].id).toBe(0);
    expect(window.UDAClickObjects[1].id).toBe(1);
  });
});
