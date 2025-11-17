import { getRecSequenceData, getRecordingState } from './recordingSelectors';
import { DigitalAssistantCore, setRecSequenceData } from '../../index';

describe('recordingSelectors', () => {
  /*it('getRecordingState returns the recording slice', () => {
    const state: any = DigitalAssistantCore.getState();
    const rec = getRecordingState(state as any);
    expect(rec).toHaveProperty('recSequenceData');
    expect(Array.isArray(rec.recSequenceData)).toBe(true);
  });

  it('getRecSequenceData reflects updates', () => {
    const initial = getRecSequenceData(DigitalAssistantCore.getState() as any);
    const next = [...initial, { tagName: 'button', id: 'x' }];
    DigitalAssistantCore.dispatch(setRecSequenceData(next));

    const after = getRecSequenceData(DigitalAssistantCore.getState() as any);
    expect(after.length).toBe(next.length);
    expect(after[after.length - 1]).toMatchObject({ tagName: 'button', id: 'x' });
  });*/
});
