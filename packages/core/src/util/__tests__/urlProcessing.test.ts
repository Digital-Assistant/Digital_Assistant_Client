
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

  it('should replace placeholders with values', () => {
    const url = '/search/all?query=#keyword#&domain=#domain#';
    const params = { keyword: 'test', domain: 'example.com' };
    const expected = '/search/all?query=test&domain=example.com';
    expect(processUrlArgs(url, params)).toBe(expected);
  });

  it('should handle empty string values for placeholders', () => {
    const url = '/search/all?query=#keyword#&domain=#domain#';
    const params = { keyword: '', domain: 'example.com' };
    const expected = '/search/all?query=&domain=example.com';
    expect(processUrlArgs(url, params)).toBe(expected);
  });

  it('should handle null and undefined values for placeholders', () => {
    const url = '/search/all?query=#keyword#&domain=#domain#&page=#page#';
    const params = { keyword: 'test', domain: null, page: undefined };
    const expected = '/search/all?query=test&domain=&page=';
    expect(processUrlArgs(url, params)).toBe(expected);
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

  it('should handle both placeholders and redaction', () => {
    const url = '/search?query=#keyword#&token=#token#';
    const params = { keyword: 'test', token: { value: 'secret', redact: true } };
    const expected = '/search?query=test&token=REDACTED';
    expect(processUrlArgs(url, params)).toBe(expected);
  });

  it('should correctly process a complex URL with multiple features', () => {
    const url = '/search/#type#?query=#keyword#&domain=#domain#&user=#user#&page=#page##details';
    const params = {
      type: 'all',
      keyword: 'complex search',
      domain: 'test.com',
      user: { value: 'sensitive-user', redact: true },
      page: 1,
    };
    const expected = '/search/all?query=complex%20search&domain=test.com&user=REDACTED&page=1#details';
    expect(processUrlArgs(url, params)).toBe(expected);
  });
});
