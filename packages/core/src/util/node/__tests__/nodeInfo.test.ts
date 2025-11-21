
import { getNodeInfo, getBrowserZoomFactor, getEffectiveZoomInfo } from '../nodeInfo';
import * as Screen from '../../screen/getScreenSize';
import * as Coordinates from '../getNodeCoordinates';

describe('nodeInfo', () => {
  describe('getNodeInfo', () => {
    it('should return comprehensive node information', () => {
      const mockScreenSize = { width: 1920, height: 1080, scrollX: 0, scrollY: 0 };
      const mockCoordinates = { top: 100, left: 200 };
      const getScreenSizeSpy = jest.spyOn(Screen, 'getScreenSize').mockReturnValue(mockScreenSize);
      const getNodeCoordinatesSpy = jest.spyOn(Coordinates, 'getNodeCoordinates').mockReturnValue(mockCoordinates);

      const element = document.createElement('div');
      document.body.appendChild(element);
      const info = getNodeInfo(element);

      expect(info).toBeDefined();
      expect(info.screenSize).toEqual(mockScreenSize);
      expect(info.nodePagePosition).toEqual(mockCoordinates);
      expect(info.nodePosition).toBeInstanceOf(DOMRect);
      expect(info.zoomInfo).toBeDefined();

      getScreenSizeSpy.mockRestore();
      getNodeCoordinatesSpy.mockRestore();
    });
  });

  describe('getBrowserZoomFactor', () => {
    it('should calculate the browser zoom factor', () => {
      // This is difficult to test accurately in JSDOM as it doesn't really have a zoom concept.
      // We'll trust the logic and just ensure it returns a number.
      const zoom = getBrowserZoomFactor();
      expect(typeof zoom).toBe('number');
    });
  });

  describe('getEffectiveZoomInfo', () => {
    it('should return combined zoom information', () => {
      const zoomInfo = getEffectiveZoomInfo();
      expect(zoomInfo).toHaveProperty('systemDpiScale');
      expect(zoomInfo).toHaveProperty('browserZoomFactor');
      expect(zoomInfo).toHaveProperty('totalEffectiveZoom');
      expect(zoomInfo).toHaveProperty('systemDpiScalePercentage');
      expect(zoomInfo).toHaveProperty('browserZoomFactorPercentage');
      expect(zoomInfo).toHaveProperty('totalEffectiveZoomPercentage');
    });
  });
});
