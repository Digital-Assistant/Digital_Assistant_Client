
import { getNodeInfo } from '../nodeInfo';

describe('nodeInfo', () => {
  it('should return node info', () => {
    const element = document.createElement('div');
    const info = getNodeInfo(element);
    expect(info).toBeDefined();
  });
});
