/* eslint-disable @typescript-eslint/no-explicit-any */
import { initClickTracking, teardownClickTracking } from '../initializeClickTracking';

describe('initializeClickTracking (headers.js migration)', () => {
  beforeEach(() => {
    teardownClickTracking();
    (window as any).UDAClickObjects = [];
    (window as any).UDARemovedClickObjects = [];
  });

  it('collects elements that register click event listeners', () => {
    initClickTracking();
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const handler = jest.fn();
    btn.addEventListener('click', handler);

    expect((window as any).UDAClickObjects.length).toBe(1);
    expect((window as any).UDAClickObjects[0].element).toBe(btn);
  });

  it('is idempotent when called multiple times', () => {
    initClickTracking();
    initClickTracking();
    const a = document.createElement('a');
    const handler = jest.fn();
    a.addEventListener('click', handler);
    expect((window as any).UDAClickObjects.length).toBe(1);
  });

  it('teardown restores original addEventListener', () => {
    initClickTracking();
    const patched = (EventTarget.prototype as any).addEventListener;
    teardownClickTracking();
    const restored = (EventTarget.prototype as any).addEventListener;
    expect(patched).not.toBe(restored);
  });
});
