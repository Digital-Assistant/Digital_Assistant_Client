export const on = (eventType, listener) => {
  document.addEventListener(eventType, listener);
}

export const off = (eventType, listener) => {
  document.removeEventListener(eventType, listener);
}

export const once = (eventType, listener) => {
  on(eventType, handleEventOnce);

  function handleEventOnce(event) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}

export const trigger = (eventType, data) => {
  const event = new CustomEvent(eventType, data);
  document.dispatchEvent(event);
}
