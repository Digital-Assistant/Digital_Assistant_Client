/**
 * Common API call functionality
 */
export const invokeApi = async (url, method, data, parseJson = true) => {
    try {
        const config: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'charset': 'UTF-8'
            }
        };
        if (data) {
            config.body = JSON.stringify(data);
        }
        let response = await fetch(url, config);
        if (response.ok) {
            if (parseJson) {
                return response.json();
            } else {
                return response.text();
            }
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}
