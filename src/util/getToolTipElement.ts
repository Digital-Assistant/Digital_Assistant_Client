/**
 * Constructs tooltip element & adds to body (if not exist)
 * @returns HTML Element
 */
import {translate} from "./translation";
import {trigger} from "./events";

export const getToolTipElement = (message = 'Please input the value and then click on', showButtons = true) => {

  let toolTipContentSection = '';

  if(!showButtons){
    toolTipContentSection += '<br />';
  }

  toolTipContentSection += message
      + '<br/>';

  if (showButtons) {
    toolTipContentSection += `
      <div class="uda-tooltip-controls">
        <button class="uda-tutorial-btn" type="button" uda-added="true" id="uda-autoplay-continue">${translate('continue')}</button>
        <button class="uda-tutorial-exit-btn" type="button" uda-added="true" id="uda-autoplay-exit">${translate('exit')}</button>
        <div class="uda-tooltip-arrows-circle">
          <button class="uda-tooltip-arrow-btn uda-tooltip-arrow-top" id="uda-tooltip-arrow-top" title="Move tooltip to top">↑</button>
          <button class="uda-tooltip-arrow-btn uda-tooltip-arrow-right" id="uda-tooltip-arrow-right" title="Move tooltip to right">→</button>
          <button class="uda-tooltip-arrow-btn uda-tooltip-arrow-bottom" id="uda-tooltip-arrow-bottom" title="Move tooltip to bottom">↓</button>
          <button class="uda-tooltip-arrow-btn uda-tooltip-arrow-left" id="uda-tooltip-arrow-left" title="Move tooltip to left">←</button>
        </div>
      </div>
    `;
  } else {
    toolTipContentSection += '<br />';
  }

  let toolTipContentElement = document.createElement("div");
  toolTipContentElement.innerHTML = toolTipContentSection.trim();
  toolTipContentElement.classList.add("uda-tooltip-text-content");

  let tooltipDivElement = document.createElement("div");
  tooltipDivElement.id = "uda-tooltip";
  tooltipDivElement.classList.add("uda-tooltip");
  tooltipDivElement.innerHTML =
      '<div id="uda-arrow" class="uda-arrow" data-popper-arrow></div>';
  tooltipDivElement.prepend(toolTipContentElement);

  const shadowRoot = document.getElementById('udan-react-root').shadowRoot;

  const toolTipExists = shadowRoot.getElementById("uda-tooltip");
  if (toolTipExists) {
    shadowRoot.removeChild(toolTipExists);
  }

  shadowRoot.appendChild(tooltipDivElement);

  // Attach position change handlers to arrow buttons
  setTimeout(() => {
    const topBtn = shadowRoot.getElementById("uda-tooltip-arrow-top");
    const rightBtn = shadowRoot.getElementById("uda-tooltip-arrow-right");
    const bottomBtn = shadowRoot.getElementById("uda-tooltip-arrow-bottom");
    const leftBtn = shadowRoot.getElementById("uda-tooltip-arrow-left");

    topBtn?.addEventListener("click", () => {
      trigger("ChangeTooltipPosition", {detail: {position: 'top'}});
    });

    rightBtn?.addEventListener("click", () => {
      trigger("ChangeTooltipPosition", {detail: {position: 'right'}});
    });

    bottomBtn?.addEventListener("click", () => {
      trigger("ChangeTooltipPosition", {detail: {position: 'bottom'}});
    });

    leftBtn?.addEventListener("click", () => {
      trigger("ChangeTooltipPosition", {detail: {position: 'left'}});
    });

    // Optional: Add keyboard arrow support
    document.addEventListener('keydown', (event) => {
      if (!tooltipDivElement.isConnected) return;

      switch(event.key) {
        case 'ArrowUp':
          trigger("ChangeTooltipPosition", {detail: {position: 'top'}});
          break;
        case 'ArrowRight':
          trigger("ChangeTooltipPosition", {detail: {position: 'right'}});
          break;
        case 'ArrowDown':
          trigger("ChangeTooltipPosition", {detail: {position: 'bottom'}});
          break;
        case 'ArrowLeft':
          trigger("ChangeTooltipPosition", {detail: {position: 'left'}});
          break;
      }
    });
  }, 100);


  return tooltipDivElement;
};
