import { domService } from './domService';
import { store } from '../store';

describe('DomService', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="uda-container">
        <button id="btn1">Click Me</button>
        <a href="#" id="link1">Click Me</a>
        <p id="p1">Some text</p>
      </div>
    `;
  });

  it('should add body events', () => {
    const addClickToNodeSpy = jest.spyOn(domService, 'addClickToNode');
    domService.addBodyEvents();
    expect(addClickToNodeSpy).toHaveBeenCalledTimes(0);
  });

  it('should identify clickable nodes', () => {
    const btn = document.getElementById('btn1') as HTMLElement;
    const link = document.getElementById('link1') as HTMLElement;
    const p = document.getElementById('p1') as HTMLElement;

    expect(domService.isClickableNode(btn)).toBe(false);
    expect(domService.isClickableNode(link)).toBe(false);
    expect(domService.isClickableNode(p)).toBe(false);
  });

  it('should dispatch to recording state when node is clicked', () => {
    const btn = document.getElementById('btn1') as HTMLElement;
    // attach listener
    domService.addClickToNode(btn);
    // simulate click
    btn.click();
    const state: any = (store as any).getState();
    expect(state.recording.recSequenceData.length).toBeGreaterThan(0);
    const last = state.recording.recSequenceData[state.recording.recSequenceData.length - 1];
    expect(last.tagName).toBe('button');
  });

  it('should get all children', () => {
    const container = document.querySelector('.uda-container') as HTMLElement;
    const children = domService.getAllChildren(container);
    expect(children.length).toBe(4);
  });

  it('should squeeze the body', async () => {
    (global as any).UDAGlobalConfig = { enableOverlay: false } as any;
    await domService.squeezeBody(false);
    expect(document.body.style.maxWidth).toBe('77%');
    await domService.squeezeBody(true);
    expect(document.body.style.maxWidth).toBe('100%');
  });

  it('should get absolute offsets', () => {
    const btn = document.getElementById('btn1') as HTMLElement;
    const offsets = domService.getAbsoluteOffsets(btn);
    expect(offsets).toHaveProperty('x');
    expect(offsets).toHaveProperty('y');
  });
});