/**
 * Common API call functionality
 */

import {CustomConfig} from "../config/CustomConfig";

global.UDAGlobalConfig = CustomConfig;

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

        const baseProdURL = process.env.baseProdURL;
        const baseTestURL = process.env.baseTestURL;

        let baseURL = baseProdURL;

        if(url.indexOf("http") === -1){
            if(global.UDAGlobalConfig.environment === 'TEST'){
                baseURL = baseTestURL;
            }
            url = baseURL+url;
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
