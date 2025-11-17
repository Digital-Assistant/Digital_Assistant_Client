
import { removeCircularReference } from '../removeCircularReference';

describe('removeCircularReference', () => {
  it('should remove circular reference', () => {
    const obj: any = { a: 1 };
    obj.b = obj;
    const newObj = removeCircularReference(obj);
    expect(newObj.b).toBeUndefined();
  });
});
