
import { UDAErrorLogger } from '../error-log';

describe('errorLog', () => {
  it('should log error', () => {
    const error = new Error('test');
      UDAErrorLogger.error(error);
  });
});
