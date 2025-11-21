
import { getAllChildren } from '../getAllChildren';

describe('getAllChildren', () => {
  it('should return an empty array for an element with no children', () => {
    const element = document.createElement('div');
    const children = getAllChildren(element);
    expect(children).toEqual([]);
  });

  it('should return all direct children of an element', () => {
    const element = document.createElement('div');
    const child1 = document.createElement('span');
    const child2 = document.createElement('p');
    element.appendChild(child1);
    element.appendChild(child2);
    const children = getAllChildren(element);
    expect(children).toEqual([child1, child2]);
  });

  it('should return all nested children of an element', () => {
    const element = document.createElement('div');
    const child1 = document.createElement('span');
    const grandchild = document.createElement('a');
    child1.appendChild(grandchild);
    element.appendChild(child1);
    const children = getAllChildren(element);
    expect(children).toEqual([child1, grandchild]);
  });

  it('should not include text nodes or comments', () => {
    const element = document.createElement('div');
    element.innerHTML = 'some text <!-- a comment --><span>a child</span>';
    const children = getAllChildren(element);
    expect(children.length).toBe(1);
    expect(children[0].tagName).toBe('SPAN');
  });

  it('should not get children of script and style tags', () => {
    const element = document.createElement('div');
    element.innerHTML = '<script>console.log("hello")</script><style>.red { color: red; }</style>';
    const children = getAllChildren(element);
    // It will get the script and style tags themselves, but not their content as children
    expect(children.length).toBe(2);
  });
});
