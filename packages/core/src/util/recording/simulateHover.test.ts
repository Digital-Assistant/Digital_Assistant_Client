import { simulateHover } from './simulateHover';

describe('simulateHover', () => {
  it('should dispatch mouseover event without errors', () => {
    document.body.innerHTML = `<button id="btn">Hover</button>`;
    const btn = document.getElementById('btn') as HTMLElement;
    const handler = jest.fn();
    btn.addEventListener('mouseover', handler);

    simulateHover(btn);

    expect(handler).toHaveBeenCalled();
  });
});
