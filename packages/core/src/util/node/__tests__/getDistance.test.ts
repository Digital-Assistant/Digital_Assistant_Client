
import { getDistance } from '../getDistance';
import * as Screen from '../../screen/hasValidScreenInfo';

describe('getDistance', () => {
  const mockNode1 = {
    nodePagePosition: { left: 100, top: 100 },
    screenSize: { page: { width: 1920, height: 1080 } },
    nodePosition: { x: 100, y: 100 },
  };

  const mockNode2 = {
    nodePagePosition: { left: 200, top: 200 },
    screenSize: { page: { width: 1920, height: 1080 } },
    nodePosition: { x: 200, y: 200 },
  };

  it('should calculate the distance between two nodes with the same screen size', () => {
    jest.spyOn(Screen, 'hasValidScreenInfo').mockReturnValue(true);
    const distance = getDistance(mockNode1, mockNode2);
    expect(distance).toBeCloseTo(141.42, 2);
  });

  it('should calculate the distance between two nodes with different screen sizes', () => {
    jest.spyOn(Screen, 'hasValidScreenInfo').mockReturnValue(true);
    const mockNode3 = {
      ...mockNode2,
      screenSize: { page: { width: 1024, height: 768 } },
    };
    const distance = getDistance(mockNode1, mockNode3);
    // The scaling will affect the result, so we expect a different value.
    // x2_scaled = 200 * (1920 / 1024) = 375
    // y2_scaled = 200 * (1080 / 768) = 281.25
    // deltaX = 100 - 375 = -275
    // deltaY = 100 - 281.25 = -181.25
    // distance = sqrt((-275)^2 + (-181.25)^2) = sqrt(75625 + 32851.5625) = sqrt(108476.5625) = 329.35
    expect(distance).toBeCloseTo(329.36, 2);
  });

  it('should use the fallback calculation if screen info is invalid', () => {
    jest.spyOn(Screen, 'hasValidScreenInfo').mockReturnValue(false);
    const distance = getDistance(mockNode1, mockNode2);
    expect(distance).toBeCloseTo(141.42, 2);
  });
});
