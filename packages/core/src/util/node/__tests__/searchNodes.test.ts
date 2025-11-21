
import { searchNodes } from '../searchNodes';
import * as CompareNodesModule from '../compareNodes';
import * as GetClickedInputLabelsModule from '../getClickedInputLabels';
import * as ProcessDistanceOfNodesModule from '../processDistanceOfNodes';
import * as GetObjDataModule from '../getObjData';
import * as domJSON from 'domjson';

jest.mock('domjson', () => ({
  toJSON: jest.fn(),
}));

describe('searchNodes', () => {
  let compareNodesSpy: jest.SpyInstance;
  let getClickedInputLabelsSpy: jest.SpyInstance;
  let processDistanceOfNodesSpy: jest.SpyInstance;
  let getObjDataSpy: jest.SpyInstance;
  let domToJSONSpy: jest.SpyInstance;

  beforeEach(() => {
    compareNodesSpy = jest.spyOn(CompareNodesModule, 'compareNodes');
    getClickedInputLabelsSpy = jest.spyOn(GetClickedInputLabelsModule, 'getClickedInputLabels');
    processDistanceOfNodesSpy = jest.spyOn(ProcessDistanceOfNodesModule, 'processDistanceOfNodes');
    getObjDataSpy = jest.spyOn(GetObjDataModule, 'getObjData');
    domToJSONSpy = jest.spyOn(domJSON, 'toJSON');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a single matched node', () => {
    const recordedNode = { node: { objectdata: '{}' }, clickednodename: 'label' };
    const element = document.createElement('div');
    const compareElements = [{ node: element }];

    getObjDataSpy.mockReturnValue({ node: { nodeName: 'DIV' }, meta: {} });
    domToJSONSpy.mockReturnValue({ node: { nodeName: 'DIV' } });
    compareNodesSpy.mockReturnValue({ matched: 1, count: 1, innerTextFlag: false, innerChildNodes: 0 });

    const result = searchNodes(recordedNode, compareElements);
    expect(result).toBe(element);
  });

  it('should return null if no nodes match', () => {
    const recordedNode = { node: { objectdata: '{}' } };
    const compareElements = [{ node: document.createElement('div') }];

    getObjDataSpy.mockReturnValue({ node: { nodeName: 'DIV' }, meta: {} });
    domToJSONSpy.mockReturnValue({ node: { nodeName: 'DIV' } });
    compareNodesSpy.mockReturnValue({ matched: 0, count: 1, innerTextFlag: false, innerChildNodes: 0 });

    const result = searchNodes(recordedNode, compareElements);
    expect(result).toBeNull();
  });

  it('should handle multiple matching nodes and resolve with labels', () => {
    const recordedNode = { node: { objectdata: '{}' }, clickednodename: 'label1' };
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const compareElements = [{ node: element1 }, { node: element2 }];

    getObjDataSpy.mockReturnValue({ node: { nodeName: 'DIV' }, meta: {} });
    domToJSONSpy.mockReturnValue({ node: { nodeName: 'DIV' } });
    compareNodesSpy.mockReturnValue({ matched: 1, count: 1, innerTextFlag: false, innerChildNodes: 0 });
    getClickedInputLabelsSpy.mockImplementation(node => (node === element1 ? 'label1' : 'label2'));

    const result = searchNodes(recordedNode, compareElements);
    expect(result).toBe(element1);
  });

  it('should handle multiple matching nodes and resolve with distance', () => {
    const recordedNode = { node: { objectdata: '{}' }, clickednodename: 'label' };
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const compareElements = [{ node: element1 }, { node: element2 }];

    getObjDataSpy.mockReturnValue({ node: { nodeName: 'DIV' }, meta: {} });
    domToJSONSpy.mockReturnValue({ node: { nodeName: 'DIV' } });
    compareNodesSpy.mockReturnValue({ matched: 1, count: 1, innerTextFlag: false, innerChildNodes: 0 });
    getClickedInputLabelsSpy.mockReturnValue('label');
    processDistanceOfNodesSpy.mockReturnValue(element2);

    const result = searchNodes(recordedNode, compareElements);
    expect(result).toBe(element2);
  });
});
