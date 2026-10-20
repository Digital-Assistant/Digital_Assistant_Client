/**
 *
 * @param data
 * @param key
 * @param isRaw - is raw data or json
 */
export const setToStore = (data: any, key: string, isRaw: boolean) => {
    localStorage.setItem(key, !isRaw ? JSON.stringify(data) : data);
};

/**
 *
 * @param key
 * @param isRaw - is raw data or json
 * @returns
 */
export const getFromStore = (key: string, isRaw: boolean) => {
    const data = localStorage.getItem(key);
    if (data) return !isRaw ? JSON.parse(data) : data;
};

/**
 *
 * @param key
 * @returns
 */
export const removeFromStore = (key: string) => {
    localStorage.removeItem(key);
};
