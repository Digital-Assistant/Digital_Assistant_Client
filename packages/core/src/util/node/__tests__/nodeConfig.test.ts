
import { nodeConfig } from '../nodeConfig';

describe('nodeConfig', () => {
  it('should be defined', () => {
    expect(nodeConfig).toBeDefined();
  });

  it('should match the snapshot', () => {
    expect(nodeConfig).toMatchSnapshot();
  });
});
