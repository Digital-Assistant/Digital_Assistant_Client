global.udaSpecialNodes = {

};
global.UDAClickObjects = {};

import { isClickableNode } from '../util/isClickableNode';

describe('isClickableNode', () => {
  it('should return false for null element', () => {
    const result = isClickableNode(null);
    expect(result).toBe(false);
  });
       
  it('should return true for submit button', () => {
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    submitButton.id = 'submitButton';
    submitButton.className = 'submit-button';
    document.body.appendChild(submitButton);

    global.UDAClickObjects = [];
    global.UDAClickObjects.push({ element: submitButton, id: 1 });
    expect(isClickableNode(submitButton)).toBe(true);
  });
});




 









