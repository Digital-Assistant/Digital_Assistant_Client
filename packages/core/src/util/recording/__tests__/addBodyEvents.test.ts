
// Import the function to be tested
import { addBodyEvents } from '../addBodyEvents';

// Mock dependencies
import { addClickToNode } from '../addClickToNode';
import { isClickableNode } from '../../node/isClickableNode';

jest.mock('../addClickToNode');
jest.mock('../../node/isClickableNode');

describe('addBodyEvents', () => {
  let querySelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the document body for each test
    document.body.innerHTML = '';
    // Spy on querySelectorAll to track its calls. By default, jest.spyOn calls the original implementation.
    querySelectorSpy = jest.spyOn(document.body, 'querySelectorAll');
  });

  afterEach(() => {
    // Restore the spy to avoid affecting other tests
    querySelectorSpy.mockRestore();
  });

  it('should not attach events if the body is empty', async () => {
    await addBodyEvents();
    // Assert that querySelectorAll was called, but the event functions were not
    expect(querySelectorSpy).toHaveBeenCalledWith('*');
    expect(isClickableNode).not.toHaveBeenCalled();
    expect(addClickToNode).not.toHaveBeenCalled();
  });

  it('should iterate over all elements in the body and attach events to clickable ones', async () => {
    // Arrange: Create a mix of clickable and non-clickable elements
    document.body.innerHTML = `
      <button id="btn1">Clickable</button>
      <div id="div1">Not Clickable</div>
      <a id="link1" href="#">Clickable Link</a>
      <p id="p1">Just text</p>
    `;
    
    const btn = document.getElementById('btn1');
    const div = document.getElementById('div1');
    const link = document.getElementById('link1');
    const p = document.getElementById('p1');

    // Mock isClickableNode to return true for specific elements
    (isClickableNode as jest.Mock).mockImplementation(node => {
      return node.id === 'btn1' || node.id === 'link1';
    });

    // Act
    await addBodyEvents();

    // Assert
    expect(isClickableNode).toHaveBeenCalledTimes(4);
    expect(isClickableNode).toHaveBeenCalledWith(btn);
    expect(isClickableNode).toHaveBeenCalledWith(div);
    expect(isClickableNode).toHaveBeenCalledWith(link);
    expect(isClickableNode).toHaveBeenCalledWith(p);

    expect(addClickToNode).toHaveBeenCalledTimes(2);
    expect(addClickToNode).toHaveBeenCalledWith(btn);
    expect(addClickToNode).toHaveBeenCalledWith(link);
    expect(addClickToNode).not.toHaveBeenCalledWith(div);
    expect(addClickToNode).not.toHaveBeenCalledWith(p);
  });

  it('should handle errors gracefully if isClickableNode throws an error', async () => {
    // Arrange
    document.body.innerHTML = '<button id="btn1"></button><div id="div1"></div>';
    const btn = document.getElementById('btn1');
    const div = document.getElementById('div1');
    const error = new Error('Test error');

    (isClickableNode as jest.Mock).mockImplementation(node => {
      if (node.id === 'btn1') {
        throw error;
      }
      return node.id === 'div1'; // Make the second one clickable
    });

    // Act
    await addBodyEvents();

    // Assert: The loop should continue, and the second clickable node should still get an event
    expect(isClickableNode).toHaveBeenCalledTimes(2);
    expect(addClickToNode).toHaveBeenCalledTimes(1);
    expect(addClickToNode).toHaveBeenCalledWith(div);
  });

  it('should handle a large number of elements without crashing', async () => {
    // Arrange: Create a large number of elements
    let largeHtml = '';
    for (let i = 0; i < 1000; i++) {
      largeHtml += `<div id="el${i}"></div>`;
    }
    document.body.innerHTML = largeHtml;

    (isClickableNode as jest.Mock).mockReturnValue(false); // None are clickable for simplicity

    // Act
    await addBodyEvents();

    // Assert: Check if it processed all elements
    expect(isClickableNode).toHaveBeenCalledTimes(1000);
    expect(addClickToNode).not.toHaveBeenCalled();
  });

  it('should not fail if querySelectorAll returns an empty NodeList', async () => {
    // Arrange: Mock querySelectorAll to return an empty list for this specific test
    querySelectorSpy.mockReturnValue(document.querySelectorAll('nonexistent'));

    // Act
    await addBodyEvents();

    // Assert
    expect(isClickableNode).not.toHaveBeenCalled();
    expect(addClickToNode).not.toHaveBeenCalled();
  });
});
