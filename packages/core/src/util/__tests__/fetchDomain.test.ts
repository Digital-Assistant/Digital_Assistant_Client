
import { fetchDomain } from '../fetchDomain';

describe('fetchDomain', () => {
  it('should fetch domain', () => {
    const domain = fetchDomain();
    expect(domain).toBeDefined();
  });
});
