import { isClickableNode } from '../util/isClickableNode'; 

describe('isClickableNode', () => {
  it('should return false for null element', () => {
    const result = isClickableNode(null);
    expect(result).toBe(false);
  });
});
  

  it('should return false for element inside UdaPanel', () => {

    Element.prototype.closest = jest.fn().mockReturnValue(document.createElement('div'));

    test('isClickableNode - div', () => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'check';
        checkbox.value = '1';
        checkbox.id = 'GFG';
        checkbox.checked = true; 
        test('isClickableNode');
        document.body.appendChild(checkbox);
    })

});