
import { mapSelectedElementAction } from '../mapSelectedElementAction';

describe('mapSelectedElementAction', () => {
  it('should map selected element action', () => {
    const action = mapSelectedElementAction({}, {}, {}, {}, 100);
    expect(action).toBeDefined();
  });
});
