/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Minimal screen size helper to support nodeInfo calculations during playback.
 * Mirrors the shape used by UI utilities: { screen: { width, height }, scrollInfo: { scrollTop, scrollLeft } }
 */
export const getScreenSize = () => {
  try {
    const doc = document.documentElement || (document.body as any);
    const scrollTop = (window as any).pageYOffset || doc.scrollTop || 0;
    const scrollLeft = (window as any).pageXOffset || doc.scrollLeft || 0;
    return {
      screen: {
        width: window.innerWidth || doc.clientWidth || 0,
        height: window.innerHeight || doc.clientHeight || 0,
      },
      scrollInfo: {
        scrollTop,
        scrollLeft,
      },
    };
  } catch {
    return {
      screen: { width: 0, height: 0 },
      scrollInfo: { scrollTop: 0, scrollLeft: 0 },
    };
  }
};
