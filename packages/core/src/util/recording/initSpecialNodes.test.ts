import { initSpecialNodes } from './initSpecialNodes';
import { domService } from '../../services/domService';

jest.mock('../../services/domService', () => {
  const actual = jest.requireActual('../../services/domService');
  return {
    ...actual,
    domService: {
      ...actual.domService,
      initSpecialNodes: jest.fn(async () => undefined),
    },
  };
});

describe('initSpecialNodes wrapper', () => {
  it('delegates to domService.initSpecialNodes', async () => {
    await initSpecialNodes();
    expect(domService.initSpecialNodes).toHaveBeenCalledTimes(1);
  });
});
