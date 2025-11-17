
import { AddToClickObjects } from '../addToClickObject';

describe('addToClickObject', () => {
  it('should add to click object', () => {
    const obj: any = {};
      AddToClickObjects(obj);
    expect(obj['test']).toBe('test');
  });
});
