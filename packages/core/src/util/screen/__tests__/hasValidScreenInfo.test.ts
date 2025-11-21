import { hasValidScreenInfo } from '../hasValidScreenInfo';

describe('hasValidScreenInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="uda"></div>';
    const node = document.getElementById('uda') as any;
    node.screenSize = { page: { width: 1920, height: 1080 } };
  });

  it('should return true if screen info is valid', () => {
    const node: any = document.getElementById('uda');
    const result = hasValidScreenInfo(node);
    expect(result).toBe(true);
  });

  it('should return false for invalid or missing screen info', () => {
    const bad = document.createElement('div') as any;
    bad.screenSize = { page: { width: 0, height: -1 } };
    expect(hasValidScreenInfo(bad)).toBe(false);

    expect(hasValidScreenInfo(null as any)).toBe(false);
  });
});
