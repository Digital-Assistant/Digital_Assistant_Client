
// Import the function to be tested
import { addEvent } from '../addEvent';

// Mock dependencies
import { recordUserClick } from '../recordUserClick';

jest.mock('../recordUserClick');

describe('addEvent', () => {
  let node: HTMLElement;
  let event: MouseEvent;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create a fresh element and event for each test
    node = document.createElement('button');
    event = new MouseEvent('click', { bubbles: true });
    // Spy on addEventListener to verify it's called correctly
    jest.spyOn(node, 'addEventListener');
  });

  it('should add a custom callback function as the event listener', () => {
    const customCallback = jest.fn();
    addEvent(node, 'click', customCallback);

    // Verify that addEventListener was called with the custom callback
    expect(node.addEventListener).toHaveBeenCalledWith('click', customCallback, { once: false });

    // Simulate the event
    node.dispatchEvent(event);

    // Check if the custom callback was executed
    expect(customCallback).toHaveBeenCalledTimes(1);
    expect(recordUserClick).not.toHaveBeenCalled();
  });

  it('should add the default recordUserClick handler if no callback is provided', async () => {
    addEvent(node, 'click', null);

    // Get the handler function passed to addEventListener
    const handler = (node.addEventListener as jest.Mock).mock.calls[0][1];
    expect(node.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), { once: false });

    // Simulate the event by calling the handler
    await handler(event);

    // Check if the default handler was executed
    expect(recordUserClick).toHaveBeenCalledTimes(1);
    expect(recordUserClick).toHaveBeenCalledWith(node, event);
  });

  it('should attach the listener for a different event type (e.g., "mouseover")', () => {
    const customCallback = jest.fn();
    addEvent(node, 'mouseover', customCallback);

    expect(node.addEventListener).toHaveBeenCalledWith('mouseover', customCallback, { once: false });

    // Simulate the event
    const mouseoverEvent = new MouseEvent('mouseover');
    node.dispatchEvent(mouseoverEvent);

    expect(customCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle being called multiple times on the same node', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    addEvent(node, 'click', callback1);
    addEvent(node, 'click', callback2);

    // Simulate the event
    node.dispatchEvent(event);

    // Both listeners should be attached and executed
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(node.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should not fail if the node does not support addEventListener', () => {
    // Arrange: Create an object that looks like a node but lacks the method
    const fakeNode: any = {};

    // Act & Assert: The test will fail if an unhandled exception is thrown
    expect(() => {
      addEvent(fakeNode, 'click', () => {});
    }).toThrow(); // Expect it to throw because addEventListener is not a function
  });
});
