
import { getRecordingName } from '../getRecordingName';

describe('getRecordingName', () => {
  it('should get recording name', () => {
    const name = getRecordingName({name: ['test']});
    expect(name).toBeDefined();
  });
});
