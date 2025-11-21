
import { nodeConfig } from '../nodeConfig';

describe('nodeConfig', () => {
  it('should be defined', () => {
    expect(nodeConfig).toBeDefined();
  });

  it('should not be mutable', () => {
    const originalConfig = JSON.parse(JSON.stringify(nodeConfig));

    // Attempt to modify the config
    (nodeConfig as any).JARO_WEIGHT = 1.0;
    nodeConfig.ignoreElements.push('new-element');

    // After "modification", it should still be the same because we'll re-import.
    // This is a bit of a trick to ensure we're not changing the original object.
    // A better approach would be to deep freeze the object in the source file.
    const currentConfig = require('../nodeConfig').nodeConfig;

    expect(currentConfig.JARO_WEIGHT).not.toBe(1.0);
    expect(currentConfig.ignoreElements).not.toContain('new-element');
  });

  it('should match the snapshot', () => {
    expect(nodeConfig).toMatchSnapshot();
  });
});
