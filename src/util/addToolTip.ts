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
export const addToolTip = (invokingNode, tooltipNode, recordedData = null, navigationCookieData, enableClick = false, enableFocus = false, enableAnimate = false, message = translate('tooltipMessage'), showButtons = true, isNavigating=false) => {

  if (recordedData !== null) {
    let recordedNodeData = JSON.parse(recordedData.objectdata);
    if (recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('tooltipInfo') && recordedNodeData.meta.tooltipInfo != '') {
      message = recordedNodeData.meta.tooltipInfo;
    } else if(recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement==='highlight'){
      message = translate('highLightTextElement');
    }
  }

  //add scrolltop functionality
  tooltipNode.scrollIntoView({behavior: 'smooth', block: "center", inline: "center"});

  const tooltipDivElement = getToolTipElement(message, showButtons);

  /**
   * calculating node position from here
   */
  let toolTipPositionClass: any = getTooltipPositionClass(tooltipNode, tooltipDivElement);

  /*if(isNavigating){
    setTimeout(function () {
      invokingNode.click();
      removeToolTip();
    }, 500);
  }*/

  console.log(toolTipPositionClass);

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

  if(showButtons) {
    const shadowRoot = document.getElementById('udan-react-root').shadowRoot;
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
 * Removes tooltip element
 * Void()
 */
export const removeToolTip = () => {
  const shadowRoot = document.getElementById('udan-react-root').shadowRoot;
  const toolTipExists = shadowRoot.getElementById("uda-tooltip");
  if (toolTipExists) {
    shadowRoot.removeChild(toolTipExists);
  }
};
