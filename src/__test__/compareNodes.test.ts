/**
 * @fileoverview Unit tests for the compareNodes utility function.
 *
 * This test suite verifies the functionality of the compareNodes utility, which is responsible
 * for comparing DOM nodes to determine their similarity. The compareNodes function is a critical
 * component of the Digital Assistant Client that enables matching recorded nodes with nodes in
 * the current DOM during playback.
 *
 * The tests cover various comparison scenarios including:
 * - Basic node comparison with default match object
 * - Child node counting
 * - Ignoring attributes based on configuration
 * - Ignoring Angular dynamic attributes
 * - Recursive comparison of nested objects
 * - Special handling for class/className with cleaning and Jaro-Winkler similarity
 * - Weighted matching for innerText
 * - Special handling for href comparison
 * - Jaro-Winkler similarity for id/name comparison
 * - Handling of empty innerText/outerText
 * - Special handling for personal nodes
 * - URL-related attributes when enableForAllDomains is true
 * - Tracking of unmatched attributes
 * - Special handling for select elements with childNodes
 */

import { compareNodes } from '../util/compareNodes';
import { CONFIG } from '../config';
import { jaroWinkler } from 'jaro-winkler-typescript';

// Mock dependencies
jest.mock('jaro-winkler-typescript', () => ({
    jaroWinkler: jest.fn()
}));

jest.mock('../config/error-log', () => ({
    UDAConsoleLogger: {
        info: jest.fn()
    }
}));

// Mock global variables
global.udaSpecialNodes = {
    ignoreDuringCompare: {
        attributes: ['data-test-id', 'data-cy']
    }
};

global.UDAGlobalConfig = {
    enableForAllDomains: false
};

describe('compareNodes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (jaroWinkler as jest.Mock).mockImplementation((a, b) => {
            if (a === b) return 1.0;
            if (a.includes(b) || b.includes(a)) return 0.95;
            return 0.7;
        });
    });

    it('should initialize match object with default values if not provided', () => {
        const compareNode = { nodeName: 'div' };
        const recordedNode = { nodeName: 'div' };

        const result = compareNodes(compareNode, recordedNode);

        expect(result).toEqual({
            count: 1,
            matched: 1,
            unmatched: [],
            innerTextFlag: false,
            innerChildNodes: 0
        });
    });

    it('should count childNodes correctly', () => {
        const compareNode = {
            nodeName: 'div',
            childNodes: [
                { nodeName: 'span' },
                { nodeName: 'p' }
            ]
        };
        const recordedNode = {
            nodeName: 'div',
            childNodes: [
                { nodeName: 'span' },
                { nodeName: 'p' }
            ]
        };

        const result = compareNodes(compareNode, recordedNode);

        expect(result.innerChildNodes).toBe(2);
    });

    it('should ignore attributes in udaSpecialNodes.ignoreDuringCompare.attributes', () => {
        const compareNode = {
            nodeName: 'div',
            'data-test-id': 'test-id'
        };
        const recordedNode = {
            nodeName: 'div',
            'data-test-id': 'different-id'
        };

        const result = compareNodes(compareNode, recordedNode);

        // The data-test-id attribute should be ignored, so only nodeName is counted and matched
        expect(result.count).toBe(1);
        expect(result.matched).toBe(1);
        expect(result.unmatched).toEqual([]);
    });

    it('should ignore Angular dynamic attributes (_ngcontent, jQuery, __zone_symbol__)', () => {
        const compareNode = {
            nodeName: 'div'
        };
        const recordedNode = {
            nodeName: 'div',
            '_ngcontent-abc-123': 'value',
            'jQuery12345': 'value',
            '__zone_symbol__test': 'value'
        };

        const result = compareNodes(compareNode, recordedNode);

        // Only nodeName is counted and matched, Angular attributes are ignored
        expect(result.count).toBe(1);
        expect(result.matched).toBe(1);
        expect(result.unmatched).toEqual([]);
    });

    it('should ignore attributes defined in CONFIG.ignoreDynamicAttributeText', () => {
        // Temporarily modify CONFIG for this test
        const originalConfig = { ...CONFIG };
        CONFIG.ignoreDynamicAttributeText = { 'data-dynamic-': true };

        const compareNode = {
            nodeName: 'div'
        };
        const recordedNode = {
            nodeName: 'div',
            'data-dynamic-id': 'value'
        };

        const result = compareNodes(compareNode, recordedNode);

        // Only nodeName is counted and matched, dynamic attribute is ignored
        expect(result.count).toBe(1);
        expect(result.matched).toBe(1);
        expect(result.unmatched).toEqual([]);

        // Restore original CONFIG
        Object.assign(CONFIG, originalConfig);
    });

    it('should compare nested objects recursively', () => {
        const compareNode = {
            nodeName: 'div',
            style: { color: 'red', fontSize: '12px' }
        };
        const recordedNode = {
            nodeName: 'div',
            style: { color: 'red', fontSize: '12px' }
        };

        const result = compareNodes(compareNode, recordedNode);

        // nodeName and style are counted, plus the two properties inside style
        expect(result.count).toBe(4);
        expect(result.matched).toBe(4);
        expect(result.unmatched).toEqual([]);
    });

    it('should handle class/className comparison with special handling', () => {
        const compareNode = {
            nodeName: 'div',
            class: 'btn btn-primary ng-star-inserted disabled'
        };
        const recordedNode = {
            nodeName: 'div',
            class: 'btn btn-primary'
        };

        const result = compareNodes(compareNode, recordedNode);

        // The classes should match after cleaning
        expect(result.count).toBe(2);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toEqual([]);
    });

    it('should use Jaro-Winkler for class/className comparison when needed', () => {
        (jaroWinkler as jest.Mock).mockReturnValue(0.95); // High similarity

        const compareNode = {
            nodeName: 'div',
            class: 'btn btn-primary-large'
        };
        const recordedNode = {
            nodeName: 'div',
            class: 'btn btn-primary'
        };

        const result = compareNodes(compareNode, recordedNode);

        // The classes should match due to high Jaro-Winkler similarity
        expect(result.count).toBe(2);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toEqual([]);
        expect(jaroWinkler).toHaveBeenCalledWith('btn btn-primary', 'btn btn-primary-large');
    });

    it('should weight innerText matches more heavily', () => {
        const compareNode = {
            nodeName: 'div',
            innerText: 'Hello World'
        };
        const recordedNode = {
            nodeName: 'div',
            innerText: 'hello world'
        };

        const result = compareNodes(compareNode, recordedNode);

        // innerText should be weighted by CONFIG.innerTextWeight
        expect(result.count).toBe(2);
        expect(result.matched).toBe(1 + CONFIG.innerTextWeight);
        expect(result.innerTextFlag).toBe(true);
        expect(result.unmatched).toEqual([]);
    });

    it('should handle href comparison specially', () => {
        const compareNode = {
            nodeName: 'a',
            href: 'https://example.com/page'
        };
        const recordedNode = {
            nodeName: 'a',
            href: 'https://example.com/page?param=value'
        };

        const result = compareNodes(compareNode, recordedNode);

        // href should match because recordedNode href contains compareNode href
        expect(result.count).toBe(2);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toEqual([]);
    });

    it('should use Jaro-Winkler for id/name comparison', () => {
        (jaroWinkler as jest.Mock).mockReturnValue(0.95); // High similarity

        const compareNode = {
            nodeName: 'input',
            id: 'username-field'
        };
        const recordedNode = {
            nodeName: 'input',
            id: 'username_field'
        };

        const result = compareNodes(compareNode, recordedNode);

        // id should match due to high Jaro-Winkler similarity
        expect(result.count).toBe(2);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toEqual([]);
        expect(jaroWinkler).toHaveBeenCalledWith('username_field', 'username-field');
    });

    it('should handle empty innerText/outerText specially', () => {
        const compareNode = {
            nodeName: 'div'
            // innerText is undefined
        };
        const recordedNode = {
            nodeName: 'div',
            innerText: ''
        };

        const result = compareNodes(compareNode, recordedNode);

        // Empty innerText should still match
        expect(result.count).toBe(2);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toEqual([]);
    });

    it('should handle personal nodes specially', () => {
        const compareNode = {
            nodeName: 'div',
            innerText: 'Different text'
        };
        const recordedNode = {
            nodeName: 'div',
            innerText: 'Original text'
        };

        const result = compareNodes(compareNode, recordedNode, true); // isPersonalNode = true

        // For personal nodes, innerText should be weighted heavily regardless of content
        expect(result.count).toBe(2);
        expect(result.matched).toBe(1 + CONFIG.innerTextWeight);
        expect(result.innerTextFlag).toBe(true);
        expect(result.unmatched).toEqual([]);
    });

    it('should handle URL-related attributes when enableForAllDomains is true', () => {
        // Set enableForAllDomains to true for this test
        global.UDAGlobalConfig.enableForAllDomains = true;

        const compareNode = {
            nodeName: 'a',
            href: 'https://different-domain.com/page',
            origin: 'https://different-domain.com',
            host: 'different-domain.com',
            hostname: 'different-domain.com',
            search: '?param=value'
        };
        const recordedNode = {
            nodeName: 'a',
            href: 'https://example.com/page',
            origin: 'https://example.com',
            host: 'example.com',
            hostname: 'example.com',
            search: '?different=param'
        };

        const result = compareNodes(compareNode, recordedNode);

        // All URL-related attributes should match when enableForAllDomains is true
        expect(result.count).toBe(6);
        expect(result.matched).toBe(6);
        expect(result.unmatched).toEqual([]);

        // Reset for other tests
        global.UDAGlobalConfig.enableForAllDomains = false;
    });

    it('should track unmatched attributes', () => {
        const compareNode = {
            nodeName: 'div',
            id: 'test-id',
            class: 'completely-different'
        };
        const recordedNode = {
            nodeName: 'div',
            id: 'test-id',
            class: 'btn btn-primary'
        };

        // Make Jaro-Winkler return low similarity for this test
        (jaroWinkler as jest.Mock).mockReturnValue(0.5);

        const result = compareNodes(compareNode, recordedNode);

        // nodeName and id should match, but class should not
        expect(result.count).toBe(3);
        expect(result.matched).toBe(2);
        expect(result.unmatched).toHaveLength(1);
        expect(result.unmatched[0]).toEqual({
            key: 'class',
            compareNodeValues: 'completely-different',
            recordedNodeValues: 'btn btn-primary'
        });
    });

    it('should handle select elements with childNodes specially', () => {
        const compareNode = {
            nodeName: 'select',
            childNodes: [
                { nodeName: 'option', value: '1' },
                { nodeName: 'option', value: '2' }
            ]
        };
        const recordedNode = {
            nodeName: 'select',
            childNodes: [
                { nodeName: 'option', value: '1' },
                { nodeName: 'option', value: '2' },
                { nodeName: 'option', value: '3' } // Different length
            ]
        };

        const result = compareNodes(compareNode, recordedNode);

        // For select elements, childNodes comparison should be skipped
        expect(result.count).toBe(2); // nodeName and childNodes
        expect(result.matched).toBe(2); // Both should match
        expect(result.unmatched).toEqual([]);
    });
});