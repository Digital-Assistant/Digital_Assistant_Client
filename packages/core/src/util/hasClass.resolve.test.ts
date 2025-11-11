import DigitalAssistantCore, { hasClass } from '../index';

describe('hasClass export resolution', () => {
  it('exports hasClass from SDK root and works on a simple element', () => {
    document.body.innerHTML = `<div id="x" class="a b c"></div>`;
    const el = document.getElementById('x') as HTMLElement;
    expect(hasClass(el, ['z', 'b'])).toBe(true);
    expect(hasClass(el, ['z', 'y'])).toBe(false);
  });

  it('default export of module remains compatible for direct import', async () => {
    const mod = await import('./hasClass');
    const def = mod.default as (el: HTMLElement, list: string[]) => boolean;
    const el = document.createElement('div');
    el.className = 'foo bar';
    expect(def(el, ['baz', 'bar'])).toBe(true);
  });
});
