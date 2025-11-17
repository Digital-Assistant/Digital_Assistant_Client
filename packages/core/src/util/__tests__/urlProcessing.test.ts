
import { processUrlArgs } from '../urlProcessing';

describe('processUrl', () => {
  it('should process url', () => {
    const url = processUrlArgs('http://localhost:3000');
    expect(url).toBeDefined();
  });
});
