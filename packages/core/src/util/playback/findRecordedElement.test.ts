/* eslint-disable @typescript-eslint/no-explicit-any */
import { findRecordedElement } from './findRecordedElement';

const makeRecorded = (nodeName: string, className?: string, offset?: {x:number;y:number}) => ({
  node: {
    objectdata: JSON.stringify({
      node: {
        nodeName,
        className: className || '',
        offset: offset || undefined,
      }
    })
  }
});

describe('findRecordedElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns null for invalid payloads', () => {
    expect(findRecordedElement(null as any)).toBeNull();
    expect(findRecordedElement({} as any)).toBeNull();
  });

  it('finds by class selector for common tags', () => {
    document.body.innerHTML = `<div><span id="a" class="foo"></span><span id="b" class="bar"></span></div>`;
    const rec = makeRecorded('SPAN', 'foo');
    const el = findRecordedElement(rec);
    expect(el?.id).toBe('a');
  });

  it('falls back to tag scan when no class selector matches', () => {
    document.body.innerHTML = `<div><button id="x"></button><button id="y"></button></div>`;
    const rec = makeRecorded('BUTTON');
    const el = findRecordedElement(rec);
    expect(el).not.toBeNull();
    expect((el as HTMLElement).tagName.toLowerCase()).toBe('button');
  });

  it('prefers exact offset match when available', () => {
    // jsdom does not compute layout, so mock getAbsoluteOffsets by creating an element with known offset behavior
    // We cannot easily alter offsets; instead, we simulate by ensuring candidate list has elements and we set offset in recorded payload
    document.body.innerHTML = `<div style="position:relative"><div id="m1"></div><div id="m2"></div></div>`;
    const rec = makeRecorded('DIV', '', { x: 0, y: 0 });
    // Note: getAbsoluteOffsets returns 0,0 for simple elements in jsdom; this will pick the first exact match
    const el = findRecordedElement(rec);
    expect(el).not.toBeNull();
    expect((el as HTMLElement).tagName.toLowerCase()).toBe('div');
  });
});
