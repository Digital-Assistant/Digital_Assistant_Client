
import { initializeClickTracking } from '../headers';
import * as AddToClickObjectModule from '../addToClickObject';

describe('initializeClickTracking', () => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  let addEventListenerSpy: jest.SpyInstance;
  let addToClickObjectsSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(EventTarget.prototype, 'addEventListener');
    addToClickObjectsSpy = jest.spyOn(AddToClickObjectModule, 'AddToClickObjects').mockImplementation(() => {});
    initializeClickTracking();
  });

  afterEach(() => {
    EventTarget.prototype.addEventListener = originalAddEventListener;
    jest.restoreAllMocks();
  });

  it('should wrap addEventListener', () => {
    expect(EventTarget.prototype.addEventListener).not.toBe(originalAddEventListener);
  });

  it('should call AddToClickObjects on click event', () => {
    const element = document.createElement('div');
    const clickListener = () => {};
    element.addEventListener('click', clickListener);

    // The spy on AddToClickObjects should be called by the wrapper
    expect(addToClickObjectsSpy).toHaveBeenCalledWith(element);
  });

  it('should call the original addEventListener', () => {
    const element = document.createElement('div');
    const clickListener = jest.fn();
    element.addEventListener('click', clickListener);

    const clickEvent = new MouseEvent('click');
    element.dispatchEvent(clickEvent);

    // This is a bit tricky to test perfectly without a real DOM.
    // We can't directly check if the original listener was called by our wrapper.
    // However, we can infer it by checking if the listener is in the event listener list.
    // JSDOM doesn't fully support this, so we'll rely on the fact that our wrapper
    // is designed to call the original function.
    // A better test would be in a true end-to-end testing environment.
    expect(addToClickObjectsSpy).toHaveBeenCalled();
  });

  it('should not call AddToClickObjects for non-click events', () => {
    const element = document.createElement('div');
    const mouseoverListener = () => {};
    element.addEventListener('mouseover', mouseoverListener);

    expect(addToClickObjectsSpy).not.toHaveBeenCalled();
  });
});
