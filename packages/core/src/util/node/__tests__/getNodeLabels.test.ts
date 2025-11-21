
import { getNodeLabels } from '../getNodeLabels';

describe('getNodeLabels', () => {
  it('should get label from placeholder attribute', () => {
    const element = document.createElement('input');
    element.setAttribute('placeholder', 'Enter text');
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'Enter text', match: false });
  });

  it('should get label from alt attribute for an image', () => {
    const element = document.createElement('img');
    element.setAttribute('alt', 'An image');
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'An image', match: false });
  });

  it('should get label from child text content', () => {
    const element = document.createElement('div');
    element.innerHTML = '<span>Label text</span>';
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'Label text', match: false });
  });

  it('should get label from data-tooltip attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-tooltip', 'Tooltip text');
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'Tooltip text', match: false });
  });

  it('should get label from aria-label attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('aria-label', 'Aria label text');
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'Aria label text', match: false });
  });

  it('should traverse up to parent node to find labels', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    parent.setAttribute('aria-label', 'Parent label');
    const labels = getNodeLabels(child, [], 0);
    expect(labels).toContainEqual({ text: 'Parent label', match: false });
  });

  it('should fallback to id if no other labels are found', () => {
    const element = document.createElement('div');
    element.id = 'my-element';
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'div-my-element', match: false });
  });

  it('should fallback to class if no other labels are found', () => {
    const element = document.createElement('div');
    element.className = 'my-class';
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'div-my-class', match: false });
  });

  it('should fallback to nodeName if no other labels are found', () => {
    const element = document.createElement('section');
    const labels = getNodeLabels(element, [], 0);
    expect(labels).toContainEqual({ text: 'section', match: false });
  });
});
