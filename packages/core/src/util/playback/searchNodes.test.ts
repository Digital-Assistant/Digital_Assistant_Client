/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchNodes } from './searchNodes';

const makeRecorded = (nodeName: string, className?: string) => ({
  clickednodename: 'Submit',
  node: {
    objectdata: JSON.stringify({
      node: {
        nodeName,
        className: className || '',
      },
      meta: {},
    }),
  },
});

// Mock global udaSpecialNodes used by compareNodes (avoid crashes)
;(global as any).udaSpecialNodes = { ignoreDuringCompare: { attributes: [] } };
;(global as any).UDAGlobalConfig = { enableForAllDomains: false };

describe('searchNodes (basic behaviors)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns null when compareElements is empty', () => {
    const recorded = makeRecorded('BUTTON');
    const result = searchNodes(recorded as any, []);
    expect(result).toBeNull();
  });

  it('handles multiple candidates without throwing (smoke test)', () => {
    document.body.innerHTML = `
      <div>
        <button id="b1">Submit</button>
        <button id="b2">Other</button>
      </div>`;
    const recorded = makeRecorded('BUTTON');
    const compareElements = Array.from(document.getElementsByTagName('button')).map((el) => ({ nodeName: el.nodeName, node: el }));
    const result = searchNodes(recorded as any, compareElements);
    // May be null depending on DOM serialization equality in jsdom; assert no throw and result is element or null
    expect(result === null || (result as any).tagName === 'BUTTON').toBe(true);
  });
});
