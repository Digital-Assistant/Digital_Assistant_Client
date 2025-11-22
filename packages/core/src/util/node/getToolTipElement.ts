/**
 * This module provides a function to create and manage a tooltip element.
 * The tooltip is used to guide users during tutorials or other interactive sessions.
 */
import {translate} from "../translate/translation";
import {trigger} from "./events";

/**
 * Constructs a tooltip element and adds it to the document's shadow DOM.
 * If a tooltip already exists, it is replaced.
 *
 * @param message The message to be displayed in the tooltip.
 * @param showButtons A boolean to control whether to show the 'continue' and 'change position' buttons.
 * @returns The created tooltip HTML element.
 */
export const getToolTipElement = (message = 'Please input the value and then click on', showButtons = true) => {

  // Create the main tooltip container.
  let tooltipDivElement = document.createElement("div");
  tooltipDivElement.id = "uda-tooltip";
  tooltipDivElement.classList.add("uda-tooltip");

  // Create the tooltip header with an exit button.
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

  // Create the tooltip controls with a 'continue' button and a button to change the tooltip's position.
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

  // Create the container for the tooltip's message content.
  const tooltipContent = document.createElement("div");
  tooltipContent.classList.add("uda-tooltip-text-content");
  tooltipContent.innerHTML = message;

  // Create the arrow element for the tooltip, used by Popper.js for positioning.
  const arrowElement = document.createElement("div");
  arrowElement.id = "uda-arrow";
  arrowElement.classList.add("uda-arrow");
  arrowElement.setAttribute("data-popper-arrow", "");

  // Assemble the tooltip by appending its parts.
  tooltipDivElement.appendChild(tooltipHeader);
  tooltipDivElement.appendChild(tooltipContent);

  // Only add the controls if `showButtons` is true.
  if (showButtons) {
    tooltipDivElement.appendChild(tooltipControls);
  }

  tooltipDivElement.appendChild(arrowElement);

  // Append the tooltip to the shadow root of the UDA container.
  // This is done safely to avoid errors in environments like tests where the shadow root may not exist.
  try {
    // @ts-ignore
    const wrapper: any = document.getElementById('udan-react-root');
    const shadowRoot: any = wrapper?.shadowRoot;
    if (shadowRoot) {
      const toolTipExists = shadowRoot.getElementById("uda-tooltip");
      if (toolTipExists) {
        shadowRoot.removeChild(toolTipExists);
      }
      shadowRoot.appendChild(tooltipDivElement);
    }
  } catch (_) {
    // Ignore errors if the shadow root is not found.
  }

  // Set up event handlers for the tooltip's buttons after a short delay.
  setTimeout(() => {
    let directionBtn: any = null;
    try {
      // @ts-ignore
      const wrapper: any = document.getElementById('udan-react-root');
      const shadowRoot: any = wrapper?.shadowRoot;
      directionBtn = shadowRoot?.getElementById("uda-tooltip-direction-change");
    } catch (_) { /* ignore */ }

    // Track the current position of the tooltip.
    let currentPosition = 'top';
    const positions = ['top', 'right', 'bottom', 'left'];

    // Add a click listener to the direction change button to cycle through positions.
    directionBtn?.addEventListener("click", () => {
      // Get the next position in a clockwise direction.
      const currentIndex = positions.indexOf(currentPosition);
      const nextIndex = (currentIndex + 1) % positions.length;
      currentPosition = positions[nextIndex];

      // Trigger a custom event to notify other parts of the application about the position change.
      trigger("ChangeTooltipPosition", {detail: {position: currentPosition}});
    });

  }, 100);

  return tooltipDivElement;
};
