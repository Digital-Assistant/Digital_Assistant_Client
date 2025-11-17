/**
 * To recorded meta data
 * @param obj
 * @returns
 */
export const getObjData = (obj: string) => {
    try {
        const _objData = JSON.parse(obj);
        if (_objData && _objData.meta === undefined) _objData.meta = {};
        return _objData;
    } catch (e) {
        console.log(e);
        return {};
    }
};