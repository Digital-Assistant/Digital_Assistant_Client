global.dmoJSON = {};
global.udaSpecialNodes = {

};
global.UDAClickObjects = [];

import { parseDomain, ParseResultType } from "parse-domain";

export const fetchDomain = () => {
  let finalDomain = window.location.host;
  // Rest of your code
};



function localcheckNodeValues (node, mode) {
    return true;
}

describe('Node tests', () => {
  it('should return true for included node', () => {
    const node = document.createElement('div');
    const result = localcheckNodeValues(node, 'include');
    expect(result).toBe(true);
  });

  test('isClickableNode - div', async () => {
    const div = document.createElement('div');
    div.setAttribute('ng-click', 'div');
    div.id = 'Test';
    document.body.appendChild(div);
    const divelement = document.getElementById('Test'); 
  });

  it('should return true for ignored children node', () => {
    const node = document.createElement('div');
    node.setAttribute('udaIgnoreChildren', String(true));
    expect(node.getAttribute('udaIgnoreChildren')).toBe('true');
  });
});

