
import { processUrlArgs } from '../urlProcessing';

describe('processUrlArgs', () => {
  it('should return the same URL if no params are provided', () => {
    const url = 'http://localhost:3000/path';
    expect(processUrlArgs(url)).toBe(url);
  });

  it('should return the same URL if params object is empty', () => {
    const url = 'http://localhost:3000/path';
    expect(processUrlArgs(url, {})).toBe(url);
  });

  it('should redact specified query parameters', () => {
    const url = 'http://localhost:3000/path?a=1&b=2&c=3';
    const expected = 'http://localhost:3000/path?a=1&b=REDACTED&c=3';
    expect(processUrlArgs(url, { b: { redact: true } })).toBe(expected);
  });

  it('should handle multiple redacted parameters', () => {
    const url = 'http://localhost:3000/path?a=1&b=2&c=3';
    const expected = 'http://localhost:3000/path?a=REDACTED&b=REDACTED&c=3';
    expect(processUrlArgs(url, { a: { redact: true }, b: { redact: true } })).toBe(expected);
  });

  it('should handle URLs with no query string', () => {
    const url = 'http://localhost:3000/path';
    expect(processUrlArgs(url, { a: { redact: true } })).toBe(url);
  });

  it('should handle URLs with a hash', () => {
    const url = 'http://localhost:3000/path?a=1#section';
    const expected = 'http://localhost:3000/path?a=REDACTED#section';
    expect(processUrlArgs(url, { a: { redact: true } })).toBe(expected);
  });

  it('should not redact if redact is false', () => {
    const url = 'http://localhost:3000/path?a=1';
    expect(processUrlArgs(url, { a: { redact: false } })).toBe(url);
  });
});
