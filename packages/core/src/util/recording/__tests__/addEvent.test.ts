
import { addEvent } from '../addEvent';

describe('addEvent', () => {
  it('should add event', () => {
    const element = document.createElement('div');
    addEvent(element, 'click', () => {});
  });
});
