import { checkNodeValues } from './checkNodeValues';

// Prepare global special nodes bag
;(global as any).udaSpecialNodes = {
  include: { tags: ['button'], classes: ['force-include'] },
  exclude: { tags: ['p'] },
  ignoreChildren: { classes: ['mark-ignore-children'] },
  ignoreClicksOnNodes: { attributes: ['udaIgnoreClick'] },
  ids: { ids: ['special-id'] },
};

describe('checkNodeValues', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <button id="btn" class="force-include">Click</button>
        <p id="para">Paragraph</p>
        <div id="special-id">Special</div>
      </div>`;
  });

  it('returns true when node tag is present in category list', () => {
    const para = document.getElementById('para') as HTMLElement;
    expect(checkNodeValues(para, 'exclude')).toBe(true);
  });

  it('returns true when node has any of the classes in category list', () => {
    const btn = document.getElementById('btn') as HTMLElement;
    expect(checkNodeValues(btn, 'include')).toBe(true);
  });

  it('returns true when node has any of the attributes in category list', () => {
    const btn = document.getElementById('btn') as HTMLElement;
    btn.setAttribute('udaIgnoreClick', 'true');
    expect(checkNodeValues(btn, 'ignoreClicksOnNodes')).toBe(true);
  });

  it('returns true when node id matches category list', () => {
    const el = document.getElementById('special-id') as HTMLElement;
    expect(checkNodeValues(el, 'ids')).toBe(true);
  });
});
