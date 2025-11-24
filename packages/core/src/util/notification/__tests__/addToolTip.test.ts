import { addToolTip, updateTooltipPosition, removeToolTip } from '../addToolTip';
import { createPopperLite } from '@popperjs/core';
import { translate } from '../../translate/translation';
import { getToolTipElement } from '../../node/getToolTipElement';
import { getTooltipPositionClass } from '../../node/getTooltipPositionClass';
import { trigger, on } from '../../node/events';

// Mock external dependencies
jest.mock('@popperjs/core', () => ({
    createPopperLite: jest.fn(() => ({
        update: jest.fn(),
        setOptions: jest.fn(),
    })),
}));

jest.mock('../../translate/translation', () => ({
    translate: jest.fn((key) => key), // Return the key itself for simplicity
}));

jest.mock('../../node/getToolTipElement', () => ({
    getToolTipElement: jest.fn(() => {
        const div = document.createElement('div');
        div.id = 'uda-tooltip';
        return div;
    }),
}));

jest.mock('../../node/getTooltipPositionClass', () => ({
    getTooltipPositionClass: jest.fn(() => ({
        finalCssClass: 'top',
        availablePositions: ['top', 'bottom', 'left', 'right'],
    })),
}));

jest.mock('../../node/events', () => ({
    trigger: jest.fn(),
    on: jest.fn(),
}));

describe('Tooltip Functions', () => {
    let invokingNode: HTMLElement;
    let tooltipNode: HTMLElement;
    let shadowHost: HTMLElement;
    let shadowRoot: ShadowRoot;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Set up mock DOM
        invokingNode = document.createElement('button');
        invokingNode.scrollIntoView = jest.fn();
        invokingNode.focus = jest.fn();
        invokingNode.click = jest.fn();

        tooltipNode = document.createElement('div');
        tooltipNode.scrollIntoView = jest.fn();

        // Set up shadow DOM
        shadowHost = document.createElement('div');
        shadowHost.id = 'udan-react-root';
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        document.body.appendChild(shadowHost);

        // Mock buttons inside shadow DOM
        const continueButton = document.createElement('button');
        continueButton.id = 'uda-autoplay-continue';
        shadowRoot.appendChild(continueButton);

        const exitButton = document.createElement('button');
        exitButton.id = 'uda-autoplay-exit';
        shadowRoot.appendChild(exitButton);
    });

    afterEach(() => {
        // Clean up DOM
        if (shadowHost.parentElement) {
            document.body.removeChild(shadowHost);
        }
    });

    describe('addToolTip', () => {
        it('should scroll the tooltip node into view', () => {
            addToolTip(invokingNode, tooltipNode, null, null);
            expect(tooltipNode.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        });

        it('should create a Popper instance with correct parameters', () => {
            addToolTip(invokingNode, tooltipNode, null, null);
            expect(createPopperLite).toHaveBeenCalledWith(tooltipNode, expect.any(HTMLElement), expect.any(Object));
        });

        it('should use a message from recordedData if available', () => {
            const recordedData = {
                objectdata: JSON.stringify({ meta: { tooltipInfo: 'Custom Message' } }),
            };
            addToolTip(invokingNode, tooltipNode, recordedData, null);
            expect(getToolTipElement).toHaveBeenCalledWith('Custom Message', true);
        });

        it('should attach click listeners to continue and exit buttons', () => {
            addToolTip(invokingNode, tooltipNode, null, null, false, false, false, 'message', true);
            
            const continueButton = shadowRoot.getElementById('uda-autoplay-continue');
            const exitButton = shadowRoot.getElementById('uda-autoplay-exit');

            continueButton?.click();
            expect(trigger).toHaveBeenCalledWith('ContinuePlay', { action: 'ContinuePlay' });

            exitButton?.click();
            expect(trigger).toHaveBeenCalledWith('BackToSearchResults', { action: 'BackToSearchResults' });
        });

        it('should focus and click the invoking node when enabled', () => {
            jest.useFakeTimers();
            addToolTip(invokingNode, tooltipNode, null, null, true, true);
            jest.runAllTimers();
            expect(invokingNode.focus).toHaveBeenCalled();
            expect(invokingNode.click).toHaveBeenCalled();
            jest.useRealTimers();
        });
    });

    describe('updateTooltipPosition', () => {
        it('should update Popper.js instance options with the new position', () => {
            addToolTip(invokingNode, tooltipNode, null, null);
            
            // Get the mock popper instance that was created inside addToolTip
            const popperInstance = (createPopperLite as jest.Mock).mock.results[0].value;

            updateTooltipPosition('bottom');

            expect(getTooltipPositionClass).toHaveBeenCalledWith(expect.any(HTMLElement), expect.any(HTMLElement), 'bottom', 'top', expect.any(Array));
            expect(popperInstance.setOptions).toHaveBeenCalled();
        });
    });

    describe('removeToolTip', () => {
        it('should remove the tooltip element from the shadow DOM', () => {
            // First, add the tooltip, which also creates the element to be removed.
            addToolTip(invokingNode, tooltipNode, null, null);
            
            // Manually add the tooltip element to the shadow root for the test
            const tooltipElement = getToolTipElement('', false);
            shadowRoot.appendChild(tooltipElement);
            
            expect(shadowRoot.getElementById('uda-tooltip')).not.toBeNull();

            removeToolTip();
            
            expect(shadowRoot.getElementById('uda-tooltip')).toBeNull();
        });
    });
});
