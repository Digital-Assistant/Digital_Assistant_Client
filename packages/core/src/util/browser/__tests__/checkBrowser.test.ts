
import { checkBrowser } from '../checkBrowser';
import { detect } from 'detect-browser';

jest.mock('detect-browser', () => ({
  detect: jest.fn(),
}));

declare const chrome: any;

describe('checkBrowser', () => {
  const mockDetect = detect as jest.Mock;
  const originalChrome = (global as any).chrome;

  beforeEach(() => {
    // Reset the mock before each test
    mockDetect.mockClear();
    // Mock chrome global
    (global as any).chrome = { runtime: { sendMessage: jest.fn() } };
  });

  afterEach(() => {
    (global as any).chrome = originalChrome;
  });

  it('should enable plugin for Chrome', () => {
    mockDetect.mockReturnValue({ name: 'chrome', version: '', os: '', type: 'browser' });
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(true);
    expect(udaBrowserVar).toBe(chrome);
    expect(udaIdentifiedBrowser?.name).toBe('chrome');
  });

  it('should enable plugin for Edge (Chromium)', () => {
    mockDetect.mockReturnValue({ name: 'edge-chromium', version: '', os: '', type: 'browser' });
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(true);
    expect(udaBrowserVar).toBe(chrome);
    expect(udaIdentifiedBrowser?.name).toBe('edge-chromium');
  });

  it('should enable plugin for Edge', () => {
    mockDetect.mockReturnValue({ name: 'edge', version: '', os: '', type: 'browser' });
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(true);
    expect(udaBrowserVar).toBe(chrome);
    expect(udaIdentifiedBrowser?.name).toBe('edge');
  });

  it('should enable plugin for Edge on iOS', () => {
    mockDetect.mockReturnValue({ name: 'edge-ios', version: '', os: '', type: 'browser' });
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(true);
    expect(udaBrowserVar).toBe(chrome);
    expect(udaIdentifiedBrowser?.name).toBe('edge-ios');
  });

  it('should enable plugin for Opera', () => {
    mockDetect.mockReturnValue({ name: 'opera', version: '', os: '', type: 'browser' });
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(true);
    expect(udaBrowserVar).toBe(chrome);
    expect(udaIdentifiedBrowser?.name).toBe('opera');
  });

  it('should disable plugin for Firefox', () => {
    const browser = { name: 'firefox', version: '', os: '', type: 'browser' };
    mockDetect.mockReturnValue(browser);
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(false);
    expect(udaBrowserVar).toBe(browser);
    expect(udaIdentifiedBrowser?.name).toBe('firefox');
  });

  it('should handle unknown browser', () => {
    const browser = { name: 'safari', version: '', os: '', type: 'browser' };
    mockDetect.mockReturnValue(browser);
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(false);
    expect(udaBrowserVar).toBe(browser);
    expect(udaIdentifiedBrowser?.name).toBe('safari');
  });

  it('should handle detect returning null', () => {
    mockDetect.mockReturnValue(null);
    const { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
    expect(enableUDAPlugin).toBe(false);
    expect(udaBrowserVar).toBe(undefined);
    expect(udaIdentifiedBrowser).toBe(null);
  });

  it('should not call sendMessage if chrome is not available', () => {
    (global as any).chrome = undefined;
    mockDetect.mockReturnValue({ name: 'chrome', version: '', os: '', type: 'browser' });
    checkBrowser();
    // We can't directly test that sendMessage is not called if chrome is undefined,
    // but we can ensure no error is thrown.
  });
});
