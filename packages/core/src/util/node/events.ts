export const on = (eventType: any, listener: any) => {
  document.addEventListener(eventType, listener);
}

export const off = (eventType: any, listener: any) => {
  document.removeEventListener(eventType, listener);
}

export const once = (eventType: any, listener: any) => {
  on(eventType, handleEventOnce);

  function handleEventOnce(event: any) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}

export const trigger = (eventType: any, data: any) => {
  const event = new CustomEvent(eventType, data);
  document.dispatchEvent(event);
}
