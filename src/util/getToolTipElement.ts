/**
 * Constructs tooltip element & adds to body (if not exist)
 * @returns HTML Element
 */
export const getToolTipElement = (message = 'Please input the value and then click on', showButtons = true) => {
  let toolTipContentSection = message
      + '<br/>';
  if (showButtons) {
    toolTipContentSection +=
        '<button class="uda-tutorial-btn" style="margin-top:10px; margin-right: 5px;" type="button" uda-added="true" id="uda-autoplay-continue">Continue</button>' +
        '<button class="uda-tutorial-exit-btn" style="margin-top:10px;" type="button" uda-added="true" id="uda-autoplay-exit">Exit</button>';
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

  const toolTipExists = document.getElementById("uda-tooltip");
  if (toolTipExists) {
    document.body.removeChild(toolTipExists);
  }

  document.body.appendChild(tooltipDivElement);
  return tooltipDivElement;
};
