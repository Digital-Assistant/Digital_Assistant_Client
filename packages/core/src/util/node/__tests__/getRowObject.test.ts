
import { getRowObject } from '../getRowObject';
import * as GetClickedNodeLabelModule from '../getClickedNodeLabel';

describe('getRowObject', () => {
  let getClickedNodeLabelSpy: jest.SpyInstance;

  beforeEach(() => {
    getClickedNodeLabelSpy = jest.spyOn(GetClickedNodeLabelModule, 'getClickedNodeLabel').mockImplementation((row: any) => row.clickednodename);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a path from the first 5 userclicknodesSet', () => {
    const data = {
      userclicknodesSet: [
        { clickednodename: 'node1' },
        { clickednodename: 'node2' },
        { clickednodename: 'node3' },
        { clickednodename: 'node4' },
        { clickednodename: 'node5' },
        { clickednodename: 'node6' },
      ],
      name: 'test-sequence'
    };
    const result = getRowObject(data);
    expect(result.path).toBe('node1 >> node2 >> node3 >> node4 >> node5');
  });

  it('should handle a sequence name as a simple string', () => {
    const data = {
      userclicknodesSet: [],
      name: 'test-sequence'
    };
    const result = getRowObject(data);
    expect(result.sequenceName).toBe('test-sequence');
  });

  it('should parse a sequence name from a JSON string with a label', () => {
    const data = {
      userclicknodesSet: [],
      name: '[{"label": "My Sequence"}]'
    };
    const result = getRowObject(data);
    expect(result.sequenceName).toBe('My Sequence');
  });

  it('should parse a sequence name from a simple JSON string array', () => {
    const data = {
      userclicknodesSet: [],
      name: '["My Sequence"]'
    };
    const result = getRowObject(data);
    expect(result.sequenceName).toBe('My Sequence');
  });

  it('should truncate a long sequence name', () => {
    const longName = 'a'.repeat(100);
    const data = {
      userclicknodesSet: [],
      name: longName
    };
    const result = getRowObject(data);
    expect(result.sequenceName).toHaveLength(50);
  });

  it('should handle empty userclicknodesSet', () => {
    const data = {
      userclicknodesSet: [],
      name: 'test'
    };
    const result = getRowObject(data);
    expect(result.path).toBe('');
  });
});
