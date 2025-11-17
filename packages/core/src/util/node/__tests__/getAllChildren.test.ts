
import { getAllChildren } from '../getAllChildren';

describe('getAllChildren', () => {
  it('should get all children', () => {
    const element = document.createElement('div');
    const child = document.createElement('div');
    element.appendChild(child);
    const children = getAllChildren(element);
    expect(children).toBeDefined();
    expect(children.length).toBe(1);
  });
});
