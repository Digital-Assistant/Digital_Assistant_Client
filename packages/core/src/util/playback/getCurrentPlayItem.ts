import {StorageUtil} from "../storage";
import {CONFIG} from "../../config";

/**
 * compares current playable node from storage based on status "completed"
 * @returns object with index and node
 */
export const getCurrentPlayItem = () => {
    const elementsFromStore: any = StorageUtil.getFromStore(CONFIG.SELECTED_RECORDING, false);
    const retObj: any = {index: 0, node: null};
    for (let i = 0; i < elementsFromStore?.userclicknodesSet?.length; i++) {
        if (elementsFromStore?.userclicknodesSet[i].status != "completed") {
            retObj.index = i;
            retObj.node = elementsFromStore?.userclicknodesSet[i];
            retObj.additionalParams = elementsFromStore?.additionalParams;
            break;
        }
    }
    return retObj;
};