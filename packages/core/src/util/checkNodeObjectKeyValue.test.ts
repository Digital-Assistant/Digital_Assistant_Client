import { checkNodeObjectKeyValue } from './checkNodeObjectKeyValue';

// A tiny helper element factory
const makeEl = (tag: string, opts: { id?: string; className?: string; attrs?: Record<string,string>} = {}) => {
  const el = document.createElement(tag);
  if (opts.id) el.id = opts.id;
  if (opts.className) el.className = opts.className;
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k,v]) => el.setAttribute(k, v));
  }
  return el as unknown as HTMLElement;
};

describe('checkNodeObjectKeyValue', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns true when tag is in list (case-insensitive)', () => {
    const el = makeEl('BUTTON');
    expect(checkNodeObjectKeyValue(el, 'tags', ['button'], 'include')).toBe(true);
    expect(checkNodeObjectKeyValue(el, 'tags', ['div'], 'include')).toBe(false);
  });

  it('returns true when any class is in list', () => {
    const el = makeEl('div', { className: 'a b c' });
    expect(checkNodeObjectKeyValue(el, 'classes', ['x','b'], 'include')).toBe(true);
    expect(checkNodeObjectKeyValue(el, 'classes', ['x','y'], 'include')).toBe(false);
  });

  it('returns true when any attribute exists', () => {
    const el = makeEl('a', { attrs: { href: '#', role: 'button' } });
    expect(checkNodeObjectKeyValue(el, 'attributes', ['href'], 'include')).toBe(true);
    expect(checkNodeObjectKeyValue(el, 'attributes', ['data-x'], 'include')).toBe(false);
  });

  it('returns true when id is in list (case-insensitive)', () => {
    const el = makeEl('div', { id: 'MyId' });
    expect(checkNodeObjectKeyValue(el, 'ids', ['myid'], 'include')).toBe(true);
    expect(checkNodeObjectKeyValue(el, 'ids', ['other'], 'include')).toBe(false);
  });

  it('handles null/undefined node safely and returns false', () => {
    expect(checkNodeObjectKeyValue(null as any, 'tags', ['button'], 'include')).toBe(false);
    expect(checkNodeObjectKeyValue(undefined as any, 'attributes', ['href'], 'include')).toBe(false);
  });
});
