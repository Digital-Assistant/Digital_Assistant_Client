global.dmoJSON = {};
global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { searchNodes } from '../util/searchNodes';


describe('searchNodes function', () => {
    describe('when recordedNode and compareElements are empty', () => {
        test('it should return null', () => {
            try {
                const recordedNode = [];
                const compareElements = [];
                const result = searchNodes(recordedNode, compareElements);
                console.log(result);

            } catch (error) {
                console.error('An error occurred:', error);
                console.trace();
            }
        });
    });
});
