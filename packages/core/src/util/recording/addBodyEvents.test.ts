import { addBodyEvents } from './addBodyEvents';
import { domService } from '../../services/domService';

jest.mock('../../services/domService', () => {
  const actual = jest.requireActual('../../services/domService');
  return {
    ...actual,
    domService: {
      ...actual.domService,
      addBodyEvents: jest.fn(async () => undefined),
    },
  };
});

describe('addBodyEvents wrapper', () => {
  it('delegates to domService.addBodyEvents', async () => {
    await addBodyEvents();
    expect(domService.addBodyEvents).toHaveBeenCalledTimes(1);
  });
});
