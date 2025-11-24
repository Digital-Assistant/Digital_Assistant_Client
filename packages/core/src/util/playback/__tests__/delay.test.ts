
// Import the function to be tested
import { delay } from '../delay';

// Use fake timers to control setTimeout and Promises
jest.useFakeTimers();

describe('delay', () => {
  it('should resolve the promise after the specified time', async () => {
    const delayTime = 1000;
    const promise = delay(delayTime);

    // At this point, the promise should be pending
    const pendingSpy = jest.fn();
    promise.then(pendingSpy);
    expect(pendingSpy).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(delayTime);

    // Now, the promise should have resolved
    await promise;
    expect(pendingSpy).toHaveBeenCalledTimes(1);
  });

  it('should wait for the correct amount of time before resolving', async () => {
    const delayTime = 500;
    const promise = delay(delayTime);

    // Advance time by less than the delay time
    jest.advanceTimersByTime(delayTime - 1);

    // The promise should still be pending
    const pendingSpy = jest.fn();
    promise.then(pendingSpy);
    
    // Use a microtask to check if the promise has resolved
    await Promise.resolve(); 
    expect(pendingSpy).not.toHaveBeenCalled();

    // Advance time by the remaining amount
    jest.advanceTimersByTime(1);
    
    // Now it should be resolved
    await promise;
    expect(pendingSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle a delay of 0 milliseconds correctly', async () => {
    const promise = delay(0);

    // A delay of 0 should still wait for the next tick in the event loop
    const pendingSpy = jest.fn();
    promise.then(pendingSpy);
    expect(pendingSpy).not.toHaveBeenCalled();

    // Run all pending timers
    jest.runAllTimers();
    
    await promise;
    expect(pendingSpy).toHaveBeenCalledTimes(1);
  });
});
