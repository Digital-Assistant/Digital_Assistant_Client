const logger = {
    debug: jest.fn(),
    log: jest.fn()
};

// IMPORTANT First mock winston
jest.mock("winston", () => ({
    format: {
        colorize: jest.fn(),
        combine: jest.fn(),
        label: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn()
    },
    createLogger: jest.fn().mockReturnValue(logger),
    transports: {
        Console: jest.fn()
    }
}));

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