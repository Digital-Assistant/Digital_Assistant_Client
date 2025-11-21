/**
 * @file Toggles(squeeze) content body element width
 */
import {initSpecialNodes} from "../node";

/**
 * Toggles(squeeze) content body element width
 * @param hide
 */
export const squeezeBody = async (hide: boolean) => {
    await initSpecialNodes();
    if(!window.UDAGlobalConfig.enableOverlay) {
        let documentBody = document.body;
        if (!hide) {
            documentBody.style.maxWidth = '77%';
            documentBody.style.minWidth = '77%';
            documentBody.style.float = 'left';
        } else {
            documentBody.style.maxWidth = '100%';
            documentBody.style.minWidth = '100%';
            documentBody.style.float = 'none';
        }
    }
};