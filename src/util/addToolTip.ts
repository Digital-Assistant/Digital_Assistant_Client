import {translate} from "./translation";
import {createPopperLite as createPopper} from "@popperjs/core";
import {trigger} from "./events";
import {CONFIG} from "../config";
import {getToolTipElement} from "./getToolTipElement";
import {getTooltipPositionClass} from "./getTooltipPositionClass";

/**
 * To add tooltip for target elements
 */

//add tooltip display
export const addToolTip = (invokingNode, tooltipNode, recordedData = null, navigationCookieData, enableClick = false, enableFocus = false, enableAnimate = false, message = translate('tooltipMessage'), showButtons = true) => {

  if (recordedData !== null) {
    let recordedNodeData = JSON.parse(recordedData.objectdata);
    if (recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('tooltipInfo') && recordedNodeData.meta.tooltipInfo != '') {
      message = recordedNodeData.meta.tooltipInfo;
    }
  }

  //add scrolltop functionality
  tooltipNode.scrollIntoView({behavior: 'smooth', block: "start", inline: "center"});

  const tooltipDivElement = getToolTipElement(message, showButtons);

  /**
   * calculating node position from here
   */
  let toolTipPositionClass: any = getTooltipPositionClass(tooltipNode, tooltipDivElement);

  let popperInstance = createPopper(tooltipNode, tooltipDivElement, {
    placement: toolTipPositionClass,
    modifiers: [
      {
        name: 'popperOffsets',
        enabled: true,
        phase: 'main',
        options: {
          offset: ({placement, reference, popper}) => [0, 30],
        }
      }
    ],
  });


  //attach event to continue button in tooltip
  document
      .getElementById("uda-autoplay-continue")
      ?.addEventListener("click", () => {
        removeToolTip();
        trigger("ContinuePlay", {action: 'ContinuePlay'});
      });

  //attach event to close tooltip
  document
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

/**
 * Removes tooltip element
 * Void()
 */
export const removeToolTip = () => {
  const toolTipExists = document.getElementById("uda-tooltip");
  if (toolTipExists) {
    document.body.removeChild(toolTipExists);
  }
};
