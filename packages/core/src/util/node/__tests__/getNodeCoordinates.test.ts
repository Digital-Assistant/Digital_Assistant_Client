
import { getNodeCoordinates } from '../getNodeCoordinates';

describe('getNodeCoordinates', () => {
  it('should get node coordinates', () => {
    const element = document.createElement('div');
    const coordinates = getNodeCoordinates(element, { scrollInfo: { scrollTop: 0, scrollLeft: 0 } });
    expect(coordinates).toBeDefined();
  });
});
