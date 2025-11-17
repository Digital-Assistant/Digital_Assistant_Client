
import { matchAction } from '../matchAction';

describe('matchAction', () => {
  it('should match action', () => {
    const result = matchAction('test', 'test');
    expect(result).toBeDefined();
  });
});
