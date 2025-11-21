
import { getRecordingName } from '../getRecordingName';

describe('getRecordingName', () => {
  it('should return the first name from a valid JSON string', () => {
    const recordingSequence = { name: '["First Name", "Second Name"]' };
    const name = getRecordingName(recordingSequence);
    expect(name).toBe('First Name');
  });

  it('should return "NA" if the JSON array is empty', () => {
    const recordingSequence = { name: '[]' };
    const name = getRecordingName(recordingSequence);
    expect(name).toBe('NA');
  });

  it('should return an empty string for invalid JSON', () => {
    const recordingSequence = { name: '["invalid JSON' };
    const name = getRecordingName(recordingSequence);
    expect(name).toBe('');
  });

  it('should return an empty string if name property is missing', () => {
    const recordingSequence = {};
    const name = getRecordingName(recordingSequence);
    expect(name).toBe('');
  });

  it('should return an empty string if recordingSequence is null or undefined', () => {
    expect(getRecordingName(null)).toBe('');
    expect(getRecordingName(undefined)).toBe('');
  });
});
