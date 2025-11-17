
import { getDistance } from '../getDistance';

describe('getDistance', () => {
  it('should return distance', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const distance = getDistance(element1, element2);
    expect(distance).toBeDefined();
  });
});
