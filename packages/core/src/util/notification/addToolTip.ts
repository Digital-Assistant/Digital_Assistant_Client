import {translate} from "../translate/translation";
import {createPopperLite as createPopper} from "@popperjs/core";
import {trigger, on} from "../node/events";
import {CONFIG} from "../../config";
import {getToolTipElement} from "../node/getToolTipElement";
import {getTooltipPositionClass} from "../node/getTooltipPositionClass";

// Global variables to store the current Popper.js instance and related nodes.
let currentPopperInstance: any = null;
let currentTooltipNode: any = null;
let currentTooltipDivElement: any = null;
let currentToolTipPositionClass: any = null;
let currentAvailablePositions: any = [];

/**
 * Adds a tooltip to a target element, positioned using Popper.js.
 *
 * @param invokingNode The node that triggered the tooltip.
 * @param tooltipNode The target element to which the tooltip is attached.
 * @param recordedData Data from a recording, which may contain tooltip information.
 * @param navigationCookieData Data from a navigation cookie.
 * @param enableClick A boolean to enable a click on the invoking node.
 * @param enableFocus A boolean to enable focus on the invoking node.
 * @param enableAnimate A boolean to enable animation.
 * @param message The message to be displayed in the tooltip.
 * @param showButtons A boolean to show buttons in the tooltip.
 * @param isNavigating A boolean indicating if a navigation is in progress.
 */
export const addToolTip = (invokingNode: any, tooltipNode: any, recordedData: any = null, navigationCookieData: any, enableClick = false, enableFocus = false, enableAnimate = false, message = translate('tooltipMessage'), showButtons = true, isNavigating = false) => {

    // If there is recorded data, extract the tooltip message from it.
    if (recordedData !== null) {
        let recordedNodeData = JSON.parse(recordedData.objectdata);
        if (recordedNodeData?.meta?.tooltipInfo) {
            message = recordedNodeData.meta.tooltipInfo;
        } else if (recordedNodeData?.meta?.selectedElement === 'highlight') {
            message = translate('highLightTextElement');
        }
    }

    // Scroll the target element into view.
    tooltipNode.scrollIntoView({behavior: 'smooth', block: "center", inline: "center"});

    // Create the tooltip element.
    const tooltipDivElement = getToolTipElement(message, showButtons);

    // Store references to the current tooltip and its related nodes for later updates.
    currentTooltipNode = tooltipNode;
    currentTooltipDivElement = tooltipDivElement;

    // Calculate the optimal position for the tooltip.
    let {finalCssClass, availablePositions} = getTooltipPositionClass(tooltipNode, tooltipDivElement);
    currentToolTipPositionClass = finalCssClass;
    currentAvailablePositions = availablePositions;

    // Create a Popper.js instance to manage the tooltip's position.
    currentPopperInstance = createPopper(tooltipNode, tooltipDivElement, {
        placement: currentToolTipPositionClass,
        modifiers: [
            { name: 'popperOffsets', enabled: true, phase: 'main', options: { offset: () => [0, 30] } },
            { name: 'offset', options: { offset: [0, 12] } },
            { name: 'arrow', options: { padding: 5, element: '[data-popper-arrow]' } },
            { name: 'preventOverflow', options: { boundary: 'viewport', padding: 10 } }
        ],
    });

    // Listen for custom events to change the tooltip's position.
    on("ChangeTooltipPosition", (event: any) => {
        if (currentPopperInstance && event.detail?.position) {
            updateTooltipPosition(event.detail.position);
        }
    });

    // If buttons are shown, attach event listeners to them.
    if (showButtons) {
        // @ts-ignore
        const shadowRoot: any = document.getElementById('udan-react-root').shadowRoot;
        
        // Attach an event listener to the 'continue' button.
        shadowRoot.getElementById("uda-autoplay-continue")?.addEventListener("click", () => {
            removeToolTip();
            trigger("ContinuePlay", {action: 'ContinuePlay'});
        });

        // Attach an event listener to the 'exit' button.
        shadowRoot.getElementById("uda-autoplay-exit")?.addEventListener("click", () => {
            removeToolTip();
            trigger("BackToSearchResults", {action: 'BackToSearchResults'});
        });

        // After a short delay, focus or click the invoking node if enabled.
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
 * Updates the tooltip's position based on the user's selection.
 * @param position The new position for the tooltip ('top', 'right', 'bottom', or 'left').
 */
export const updateTooltipPosition = (position: string) => {
    if (!currentPopperInstance) return;

    let { finalCssClass } = getTooltipPositionClass(currentTooltipDivElement, currentTooltipDivElement, position, currentToolTipPositionClass, currentAvailablePositions);
    currentToolTipPositionClass = finalCssClass;

    // Update the 'placement' option of the Popper.js instance.
    currentPopperInstance.setOptions((options: any) => ({
        ...options,
        placement: currentToolTipPositionClass,
    }));

    // Force an update to apply the changes immediately.
    currentPopperInstance.update();
};

/**
 * Removes the tooltip element from the DOM.
 */
export const removeToolTip = () => {
    // Reset the global references.
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
