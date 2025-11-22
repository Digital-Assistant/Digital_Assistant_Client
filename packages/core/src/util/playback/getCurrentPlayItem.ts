import {StorageUtil} from "../storage";
import {CONFIG} from "../../config";

/**
 * Retrieves the current playable item from the stored recording sequence.
 * It iterates through the `userclicknodesSet` in the stored recording and returns the first node
 * that has not yet been marked as "completed".
 *
 * @returns An object containing:
 *   - `index`: The index of the current playable node in the `userclicknodesSet` array.
 *   - `node`: The current playable node object itself.
 *   - `additionalParams`: Any additional parameters associated with the recording.
 *   Returns an object with `index: 0` and `node: null` if no uncompleted node is found.
 */
export const getCurrentPlayItem = () => {
    // Retrieve the selected recording details from storage.
    const elementsFromStore: any = StorageUtil.getFromStore(CONFIG.SELECTED_RECORDING, false);
    const retObj: any = {index: 0, node: null};

    // Iterate through the `userclicknodesSet` to find the first uncompleted node.
    for (let i = 0; i < elementsFromStore?.userclicknodesSet?.length; i++) {
        if (elementsFromStore?.userclicknodesSet[i].status != "completed") {
            retObj.index = i;
            retObj.node = elementsFromStore?.userclicknodesSet[i];
            retObj.additionalParams = elementsFromStore?.additionalParams;
            break; // Stop at the first uncompleted node.
        }
    }
    return retObj;
};
