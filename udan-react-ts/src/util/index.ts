/**
 * Toggles(squeeze) content body element width
 * @param hide 
 */
export const squeezeBody = (hide: boolean) => {
    const _body = document.body;
    if (_body) {
      _body.style.width = !hide ? '' : (window.innerWidth - 350) + 'px';
    }
}