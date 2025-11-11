import { isClickableNode } from './isClickableNode';

// Mock global UDAClickObjects
;(global as any).UDAClickObjects = [];

// Mock global udaSpecialNodes bag used by checkNodeValues
;(global as any).udaSpecialNodes = {
  include: { tags: ['button'] },
  exclude: { tags: ['p'] },
  ignoreChildren: { classes: ['ignore-children'] },
  ignoreClicksOnNodes: { attributes: ['udaIgnoreClick'] },
};

describe('isClickableNode (parity with original)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <button id="btn">Click</button>
        <a id="lnk" href="#">Link</a>
        <p id="para">Paragraph</p>
        <div id="parent" class="ignore-children"><span id="child">Child</span></div>
      </div>`;
    // Ensure default CSS cursor for all
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: default; } #btn { cursor: pointer; } #lnk { cursor: pointer; }';
    document.head.appendChild(style);
  });

  it('allows elements with pointer cursor or included by special nodes', () => {
    const btn = document.getElementById('btn') as HTMLElement;
    const lnk = document.getElementById('lnk') as HTMLElement;
    const para = document.getElementById('para') as HTMLElement;

    expect(isClickableNode(btn)).toBe(true); // pointer cursor
    expect(isClickableNode(lnk)).toBe(true); // pointer cursor
    expect(isClickableNode(para)).toBe(false); // excluded by tag p
  });

  it('ignores children of elements marked with udaIgnoreChildren logic', () => {
    const child = document.getElementById('child') as HTMLElement;
    expect(isClickableNode(child)).toBe(false);
  });

  it('marks element with udaIgnoreClick as not allowed', () => {
    const para = document.getElementById('para') as HTMLElement;
    para.setAttribute('udaIgnoreClick', 'true');
    expect(isClickableNode(para)).toBe(false);
  });

  it('honors UDAClickObjects list', () => {
    const para = document.getElementById('para') as HTMLElement;
    // Not allowed by default due to exclude tag, but forced by UDAClickObjects
    (global as any).UDAClickObjects = [{ element: para }];
    expect(isClickableNode(para)).toBe(true);
  });
});
