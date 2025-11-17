
import { translate } from '../translation';

describe('translate', () => {
  it('should translate', () => {
    const text = translate('test');
    expect(text).toBeDefined();
  });
});
