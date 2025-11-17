
import { processNodeForClickData } from '../processNodeForClickData';

describe('processNodeForClickData', () => {
  it('should process node for click data', () => {
    const element = document.createElement('div');
    const data = processNodeForClickData(element);
    expect(data).toBeDefined();
  });
});
