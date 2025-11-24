
// Import the function to be tested
import { hasValidScreenInfo } from '../hasValidScreenInfo';

describe('hasValidScreenInfo', () => {
  it('should return true for a node with valid screen size information', () => {
    const node = {
      screenSize: {
        page: { width: 1920, height: 1080 }
      }
    };
    expect(hasValidScreenInfo(node)).toBe(true);
  });

  it('should return false if the node is null or undefined', () => {
    expect(hasValidScreenInfo(null)).toBe(false);
    expect(hasValidScreenInfo(undefined)).toBe(false);
  });

  it('should return false if screenSize property is missing', () => {
    const node = {
      // Missing screenSize
    };
    expect(hasValidScreenInfo(node)).toBe(false);
  });

  it('should return false if screenSize is null or undefined', () => {
    const node = {
      screenSize: null
    };
    expect(hasValidScreenInfo(node)).toBe(false);

    const node2 = {
      screenSize: undefined
    };
    expect(hasValidScreenInfo(node2)).toBe(false);
  });

  it('should return false if page property is missing from screenSize', () => {
    const node = {
      screenSize: {
        // Missing page
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);
  });

  it('should return false if page is null or undefined', () => {
    const node = {
      screenSize: {
        page: null
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);

    const node2 = {
      screenSize: {
        page: undefined
      }
    };
    expect(hasValidScreenInfo(node2)).toBe(false);
  });

  it('should return false if width is missing or invalid', () => {
    const node = {
      screenSize: {
        page: { height: 1080 } // Missing width
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);

    const node2 = {
      screenSize: {
        page: { width: 0, height: 1080 } // Width is 0
      }
    };
    expect(hasValidScreenInfo(node2)).toBe(false);

    const node3 = {
      screenSize: {
        page: { width: -100, height: 1080 } // Width is negative
      }
    };
    expect(hasValidScreenInfo(node3)).toBe(false);

    const node4 = {
      screenSize: {
        page: { width: 'abc' as any, height: 1080 } // Width is not a number
      }
    };
    expect(hasValidScreenInfo(node4)).toBe(false);
  });

  it('should return false if height is missing or invalid', () => {
    const node = {
      screenSize: {
        page: { width: 1920 } // Missing height
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);

    const node2 = {
      screenSize: {
        page: { width: 1920, height: 0 } // Height is 0
      }
    };
    expect(hasValidScreenInfo(node2)).toBe(false);

    const node3 = {
      screenSize: {
        page: { width: 1920, height: -100 } // Height is negative
      }
    };
    expect(hasValidScreenInfo(node3)).toBe(false);

    const node4 = {
      screenSize: {
        page: { width: 1920, height: 'abc' as any } // Height is not a number
      }
    };
    expect(hasValidScreenInfo(node4)).toBe(false);
  });

  it('should return false if both width and height are invalid', () => {
    const node = {
      screenSize: {
        page: { width: 0, height: 0 }
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);
  });

  it('should return false if node is an empty object', () => {
    const node = {};
    expect(hasValidScreenInfo(node)).toBe(false);
  });

  it('should return false if screenSize.page contains extra properties but invalid width/height', () => {
    const node = {
      screenSize: {
        page: { width: 100, height: 0, otherProp: 'test' }
      }
    };
    expect(hasValidScreenInfo(node)).toBe(false);
  });
});
