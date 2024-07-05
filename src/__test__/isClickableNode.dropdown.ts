import { isClickableNode } from '../util/isClickableNode'; 
import domJSON from 'domjson';

describe('isClickableNode', () => {
  it('should return false for null element', () => {
    const result = isClickableNode(null);
    expect(result).toBe(false);
  });
});

const select = document.createElement('select');
select.id = 'dropdown';

const option1 = document.createElement('option');
option1.value = 'option1';
option1.text = 'Option 1';
select.appendChild(option1);

const option2 = document.createElement('option');
option2.value = 'option2';
option2.text = 'Option 2';
select.appendChild(option2);

const option3 = document.createElement('option');
option3.value = 'option3';
option3.text = 'Option 3';
select.appendChild(option3);

document.body.appendChild(select);
test('isClickableNode');
const result = isClickableNode(select);
    expect(result).toBe(true);


