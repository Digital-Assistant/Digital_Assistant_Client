import { UDAProcessRemovedNode, UDAProcessNode } from '../util';
let UDALastMutationTime = 0;
//mutation observer initialization and adding the logic to process the clickobjects
export const dsa_observer = new MutationObserver(function (mutations) {
    // UDAConsoleLogger.info('------------ detected clicked objects-------------');
    // UDAConsoleLogger.info(UDAClickObjects);
    mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length) {
            [].some.call(mutation.removedNodes, UDAProcessRemovedNode);
        }
        if (!mutation.addedNodes.length) { 
            return;
        }
        [].some.call(mutation.addedNodes, UDAProcessNode);
    });
    // UDAConsoleLogger.info('------------ removed clicked objects-------------');
    // UDAConsoleLogger.info(UDAClickObjects);
    UDALastMutationTime = Date.now();
});

// starting the mutation observer
// dsa_observer.observe(document, {
//     childList: true,
//     subtree: true
// });