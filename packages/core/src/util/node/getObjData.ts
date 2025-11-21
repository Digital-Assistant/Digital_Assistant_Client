/**
 * To recorded meta data
 * @param obj
 * @returns
 */
export const getObjData = (obj: string) => {
    try {
        const parsed = JSON.parse(obj);
        // If it's a plain object, ensure meta exists; leave arrays/primitives as-is
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            if ((parsed as any).meta === undefined) (parsed as any).meta = {};
        }
        return parsed as any;
    } catch (e) {
        // Swallow parse errors and return empty object per tests
        return {};
    }
};