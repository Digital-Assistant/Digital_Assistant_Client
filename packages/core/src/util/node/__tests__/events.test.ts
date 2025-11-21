
import { on, off, once, trigger } from '../events';

describe('DOM Events', () => {
  let handler: jest.Mock;

  beforeEach(() => {
    handler = jest.fn();
  });

  describe('on', () => {
    it('should attach an event listener', () => {
      on('test-event', handler);
      trigger('test-event', { detail: 'test' });
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove an event listener', () => {
      on('test-event', handler);
      off('test-event', handler);
      trigger('test-event', { detail: 'test' });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('once', () => {
    it('should attach an event listener that runs only once', () => {
      once('test-event-once', handler);
      trigger('test-event-once', { detail: 'test1' });
      trigger('test-event-once', { detail: 'test2' });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail: 'test1' }));
    });
  });

  describe('trigger', () => {
    it('should trigger a custom event with data', () => {
      on('test-trigger', handler);
      const eventData = { detail: { message: 'Hello' } };
      trigger('test-trigger', eventData);
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: eventData.detail
      }));
    });
  });
});
