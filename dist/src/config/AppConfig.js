import { CustomConfig } from "./CustomConfig";
//Setting the custom variable
export const AppConfig = (data) => {
    Object.keys(CustomConfig).forEach((key, index) => {
        if (data[key] !== undefined) {
            if (typeof CustomConfig[key] === typeof data[key]) {
                CustomConfig[key] = data[key];
            }
            else {
                console.log(key + ' accepts only ' + typeof CustomConfig[key] + ' data type.');
            }
        }
        return CustomConfig;
    });
};
//# sourceMappingURL=AppConfig.js.map