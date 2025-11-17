
import { getToolTipElement } from '../getToolTipElement';

describe('getToolTipElement', () => {
  it('should get tooltip element', () => {
    const element = getToolTipElement();
    expect(element).toBeDefined();
  });
});
