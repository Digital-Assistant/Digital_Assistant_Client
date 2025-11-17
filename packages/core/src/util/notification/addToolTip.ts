import {translate} from "../translate/translation";
import {createPopperLite as createPopper} from "@popperjs/core";
import {trigger, on} from "../node/events";
import {CONFIG} from "../../config";
import {getToolTipElement} from "../node/getToolTipElement";
import {getTooltipPositionClass} from "../node/getTooltipPositionClass";

// Store popper instance globally to update it
let currentPopperInstance: any = null;
let currentTooltipNode: any = null;
let currentTooltipDivElement: any = null;
let currentToolTipPositionClass: any = null;
let currentAvailablePositions: any = [];

/**
 * To add tooltip for target elements
 */

//add tooltip display
export const addToolTip = (invokingNode: any, tooltipNode: any, recordedData: any = null, navigationCookieData: any, enableClick = false, enableFocus = false, enableAnimate = false, message = translate('tooltipMessage'), showButtons = true, isNavigating = false) => {

    if (recordedData !== null) {
        let recordedNodeData = JSON.parse(recordedData.objectdata);
        if (recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('tooltipInfo') && recordedNodeData.meta.tooltipInfo != '') {
            message = recordedNodeData.meta.tooltipInfo;
        } else if (recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement === 'highlight') {
            message = translate('highLightTextElement');
        }
    }

    //add scrolltop functionality
    tooltipNode.scrollIntoView({behavior: 'smooth', block: "center", inline: "center"});

    const tooltipDivElement = getToolTipElement(message, showButtons);

    // Store references for later updates
    currentTooltipNode = tooltipNode;
    currentTooltipDivElement = tooltipDivElement;

    /**
     * calculating node position from here
     */
    let {finalCssClass, availablePositions} = getTooltipPositionClass(tooltipNode, tooltipDivElement);
    currentToolTipPositionClass = finalCssClass;
    currentAvailablePositions = availablePositions;

    currentPopperInstance = createPopper(tooltipNode, tooltipDivElement, {
        placement: currentToolTipPositionClass,
        modifiers: [
            {
                name: 'popperOffsets',
                enabled: true,
                phase: 'main',
                options: {
                    offset: () => [0, 30],
                }
            },
            {
                name: 'offset',
                options: {
                    offset: [0, 12],
                },
            },
            {
                name: 'arrow',
                options: {
                    padding: 5,
                    element: '[data-popper-arrow]',
                },
            },
            {
                name: 'preventOverflow',
                options: {
                    boundary: 'viewport',
                    padding: 10,
                },
            }
        ],
    });

    // Listen for position change events
    on("ChangeTooltipPosition", (event: any) => {
        console.log(event.detail);
        if (currentPopperInstance && event.detail && event.detail.position) {
            updateTooltipPosition(event.detail.position);
        }
    });

    if (showButtons) {
        // @ts-ignore
        const shadowRoot: any = document.getElementById('udan-react-root').shadowRoot;
        //attach event to continue button in tooltip
        shadowRoot
            .getElementById("uda-autoplay-continue")
            ?.addEventListener("click", () => {
                removeToolTip();
                trigger("ContinuePlay", {action: 'ContinuePlay'});
            });

        //attach event to close tooltip
        shadowRoot
            .getElementById("uda-autoplay-exit")
            ?.addEventListener("click", () => {
                removeToolTip();
                trigger("BackToSearchResults", {action: 'BackToSearchResults'});
            });

        setTimeout(function () {
            if (enableFocus) {
                invokingNode.focus();
            }
            if (enableClick) {
                invokingNode.click();
            }
        }, CONFIG.DEBOUNCE_INTERVAL);
    }
}

/**
 * Updates tooltip position based on arrow button selection
 * @param position - 'top', 'right', 'bottom', or 'left'
 */
export const updateTooltipPosition = (position: string) => {
    if (!currentPopperInstance) return;

    let {
        finalCssClass,
        availablePositions
    } = getTooltipPositionClass(currentTooltipDivElement, currentTooltipDivElement, position, currentToolTipPositionClass, currentAvailablePositions);
    currentToolTipPositionClass = finalCssClass;

    // Update the placement option
    currentPopperInstance.setOptions((options: any) => ({
        ...options,
        placement: currentToolTipPositionClass,
    }));

    // Force update to apply changes immediately
    currentPopperInstance.update();
};

/**
 * Removes tooltip element
 * Void()
 */
export const removeToolTip = () => {
    // Reset the global references
    currentPopperInstance = null;
    currentTooltipNode = null;
    currentTooltipDivElement = null;

    // @ts-ignore
    const shadowRoot: any = document.getElementById('udan-react-root').shadowRoot;
    const toolTipExists: any = shadowRoot.getElementById("uda-tooltip");
    if (toolTipExists) {
        shadowRoot.removeChild(toolTipExists);
    }
};
