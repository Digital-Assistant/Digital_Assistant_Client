/**
 * Constructs tooltip element & adds to body (if not exist)
 * @returns HTML Element
 */
import {translate} from "./translation";
import {trigger} from "./events";

export const getToolTipElement = (message = 'Please input the value and then click on', showButtons = true) => {

  let tooltipDivElement = document.createElement("div");
  tooltipDivElement.id = "uda-tooltip";
  tooltipDivElement.classList.add("uda-tooltip");

  // Create the tooltip header with exit button
  const tooltipHeader = document.createElement("div");
  tooltipHeader.classList.add("uda-tooltip-header");
  tooltipHeader.innerHTML = `
  <button class="uda-tooltip-exit-btn" type="button" uda-added="true" id="uda-autoplay-exit" title="Exit tutorial">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
`;

  // Create the tooltip controls with continue button and direction change button
  const tooltipControls = document.createElement("div");
  tooltipControls.classList.add("uda-tooltip-controls");
  tooltipControls.innerHTML = `
  <button class="uda-tutorial-btn" type="button" uda-added="true" id="uda-autoplay-continue">${translate('continue')}</button>
  <button class="uda-tooltip-direction-btn" id="uda-tooltip-direction-change" title="Change tooltip position">
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="16" height="24" fill="black"/>
      <rect x="8" y="32" width="16" height="24" transform="rotate(-90 8 32)" fill="black"/>
      <path d="M27.3607 10.3759C27.6576 8.85303 27.4409 7.22499 26.6026 5.77313C25.1318 3.22552 22.2286 2.03081 19.4965 2.6001L19.8156 4.13981C21.8955 3.70603 24.11 4.61896 25.2329 6.56391C25.8498 7.63226 26.0183 8.83522 25.8225 9.96369L22.6941 9.12545L25.5409 14.0563L30.4718 11.2095L27.3607 10.3759Z" fill="black"/>
    </svg>
  </button>
`;

  // Create the tooltip content container for the message
  const tooltipContent = document.createElement("div");
  tooltipContent.classList.add("uda-tooltip-text-content");
  tooltipContent.innerHTML = message;


  // Add the arrow element
  const arrowElement = document.createElement("div");
  arrowElement.id = "uda-arrow";
  arrowElement.classList.add("uda-arrow");
  arrowElement.setAttribute("data-popper-arrow", "");

  // Assemble the tooltip
  tooltipDivElement.appendChild(tooltipHeader);
  tooltipDivElement.appendChild(tooltipContent);

  // Only add controls if showButtons is true
  if (showButtons) {
    tooltipDivElement.appendChild(tooltipControls);
  }

  tooltipDivElement.appendChild(arrowElement);

  const shadowRoot = document.getElementById('udan-react-root').shadowRoot;

  const toolTipExists = shadowRoot.getElementById("uda-tooltip");
  if (toolTipExists) {
    shadowRoot.removeChild(toolTipExists);
  }

  shadowRoot.appendChild(tooltipDivElement);

  // Attach position change handlers to direction change button
  setTimeout(() => {
    const directionBtn = shadowRoot.getElementById("uda-tooltip-direction-change");

    // Current position tracking
    let currentPosition = 'top';
    const positions = ['top', 'right', 'bottom', 'left'];

    directionBtn?.addEventListener("click", () => {
      // Get next position in clockwise direction
      const currentIndex = positions.indexOf(currentPosition);
      const nextIndex = (currentIndex + 1) % positions.length;
      currentPosition = positions[nextIndex];

      // Trigger position change
      trigger("ChangeTooltipPosition", {detail: {position: currentPosition}});
    });

    // Optional: Add keyboard arrow support
    document.addEventListener('keydown', (event) => {
      if (!tooltipDivElement.isConnected) return;

      switch(event.key) {
        case 'ArrowUp':
          currentPosition = 'top';
          trigger("ChangeTooltipPosition", {detail: {position: 'top'}});
          break;
        case 'ArrowRight':
          currentPosition = 'right';
          trigger("ChangeTooltipPosition", {detail: {position: 'right'}});
          break;
        case 'ArrowDown':
          currentPosition = 'bottom';
          trigger("ChangeTooltipPosition", {detail: {position: 'bottom'}});
          break;
        case 'ArrowLeft':
          currentPosition = 'left';
          trigger("ChangeTooltipPosition", {detail: {position: 'left'}});
          break;
      }
    });

    /*// Set up exit and continue button handlers
    const exitBtn = shadowRoot.getElementById("uda-autoplay-exit");
    exitBtn?.addEventListener("click", () => {
      trigger("ExitTutorial", {action: 'ExitTutorial'});
    });

    const continueBtn = shadowRoot.getElementById("uda-autoplay-continue");
    continueBtn?.addEventListener("click", () => {
      trigger("ContinueTutorial", {action: 'ContinueTutorial'});
    });*/
  }, 100);

  return tooltipDivElement;
};
