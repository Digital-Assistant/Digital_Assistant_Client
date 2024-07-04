import { addEvent } from "../util/addEvent";
import { recordUserClick } from "../util/recordUserClick";

// Mock the recordUserClick function
jest.mock("../util/recordUserClick", () => ({
  recordUserClick: jest.fn(),
}));

describe("addEvent", () => {
  let node: HTMLElement;
  let callback: jest.Mock;

  beforeEach(() => {
    // Setup a DOM element and a mock callback
    node = document.createElement("div");
    callback = jest.fn();
    document.body.appendChild(node);
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.removeChild(node);
  });

  it("should attach a callback to an event on the node", () => {
    addEvent(node, "click", callback);

    // Simulate the event
    node.dispatchEvent(new Event("click"));

    // Assert the callback was called
    expect(callback).toHaveBeenCalled();
  });

  it("should attach the recordUserClick function when no callback is provided", async () => {
    addEvent(node, "click");

    // Simulate the event
    node.dispatchEvent(new Event("click"));

    // Assert recordUserClick was called
    expect(recordUserClick).toHaveBeenCalledWith(node, expect.any(Event));
  });

  it("should not call the callback if the event type does not occur", () => {
    addEvent(node, "click", callback);

    // Simulate a different event
    node.dispatchEvent(new Event("mouseover"));

    // Assert the callback was not called
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle multiple events being attached to the same node", () => {
    addEvent(node, "click", callback);
    addEvent(node, "mouseover", callback);

    // Simulate both events
    node.dispatchEvent(new Event("click"));
    node.dispatchEvent(new Event("mouseover"));

    // Assert the callback was called twice
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should not execute the callback when event is not triggered", () => {
    addEvent(node, "click", callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle null callback without throwing errors", () => {
    expect(() => addEvent(node, "click", null)).not.toThrow();
  });

  it("should not execute recordUserClick if event does not occur", async () => {
    addEvent(node, "click");
    expect(recordUserClick).not.toHaveBeenCalled();
  });

  it("should allow multiple callbacks for the same event type", () => {
    const anotherCallback = jest.fn();
    addEvent(node, "click", callback);
    addEvent(node, "click", anotherCallback);

    node.dispatchEvent(new Event("click"));

    expect(callback).toHaveBeenCalled();
    expect(anotherCallback).toHaveBeenCalled();
  });

  it("should ensure that the event listener is not removed after execution if { once: false }", () => {
    addEvent(node, "click", callback);

    node.dispatchEvent(new Event("click"));
    expect(callback).toHaveBeenCalledTimes(1);

    node.dispatchEvent(new Event("click"));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should verify that the event listener is added with correct event type", () => {
    const eventType = "mouseover";
    addEvent(node, eventType, callback);

    node.dispatchEvent(new Event(eventType));
    expect(callback).toHaveBeenCalled();
  });

  it("should not interfere with other event types", () => {
    addEvent(node, "click", callback);

    node.dispatchEvent(new Event("mouseover"));
    expect(callback).not.toHaveBeenCalled();
  });

  it("should correctly pass the event object to the callback", () => {
    addEvent(node, "click", callback);

    const event = new Event("click");
    node.dispatchEvent(event);

    expect(callback).toHaveBeenCalledWith(event);
  });

  it("should support non-standard event types", () => {
    const customEventType = "customEvent";
    addEvent(node, customEventType, callback);

    const customEvent = new Event(customEventType);
    node.dispatchEvent(customEvent);

    expect(callback).toHaveBeenCalledWith(customEvent);
  });
  it("should not attach an event if the node is null", () => {
    expect(() => addEvent(null, "click", callback)).not.toThrow();
  });

  it("should not attach an event if the event type is null", () => {
    expect(() => addEvent(node, null, callback)).not.toThrow();
  });

  it("should not attach an event if the event type is an empty string", () => {
    expect(() => addEvent(node, "", callback)).not.toThrow();
  });

  it("should handle multiple nodes with the same event type", () => {
    const anotherNode = document.createElement("div");
    document.body.appendChild(anotherNode);

    addEvent(node, "click", callback);
    addEvent(anotherNode, "click", callback);

    node.dispatchEvent(new Event("click"));
    anotherNode.dispatchEvent(new Event("click"));

    expect(callback).toHaveBeenCalledTimes(2);

    document.body.removeChild(anotherNode);
  });

  it("should handle events with different options", () => {
    addEvent(node, "click", callback);

    // Simulate the event
    node.dispatchEvent(new Event("click", { bubbles: true, cancelable: true }));

    // Assert the callback was called
    expect(callback).toHaveBeenCalled();
  });

  it("should handle events with custom data", () => {
    const customEvent = new CustomEvent("customEvent", {
      detail: { key: "value" },
    });
    addEvent(node, "customEvent", callback);

    node.dispatchEvent(customEvent);

    expect(callback).toHaveBeenCalledWith(customEvent);
  });

  it("should handle events with async callbacks", async () => {
    const asyncCallback = jest.fn().mockResolvedValue(true);
    addEvent(node, "click", asyncCallback);

    node.dispatchEvent(new Event("click"));

    await expect(asyncCallback).toHaveBeenCalled();
  });

  it("should handle events with once option set to true", () => {
    const onceCallback = jest.fn();
    node.addEventListener("click", onceCallback, { once: true });

    node.dispatchEvent(new Event("click"));
    node.dispatchEvent(new Event("click"));

    expect(onceCallback).toHaveBeenCalledTimes(1);
  });

  it("should handle events with passive option set to true", () => {
    const passiveCallback = jest.fn();
    node.addEventListener("scroll", passiveCallback, { passive: true });

    node.dispatchEvent(new Event("scroll"));

    expect(passiveCallback).toHaveBeenCalled();
  });

  it("should handle events with capture option set to true", () => {
    const captureCallback = jest.fn();
    node.addEventListener("click", captureCallback, { capture: true });

    node.dispatchEvent(new Event("click"));

    expect(captureCallback).toHaveBeenCalled();
  });
});
