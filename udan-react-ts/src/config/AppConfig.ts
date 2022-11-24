import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

//Setting the custom variable
export const AppConfig  = (data: CustomConfigPropTypes) => {
  Object.keys(CustomConfig).forEach((key, index)=> {
    if(data[key] !== undefined) {
      if(typeof CustomConfig[key] === typeof data[key]) {
        CustomConfig[key] = data[key]
      } else {
        console.log(key + ' accepts only '+typeof CustomConfig[key]+' data type.');
      }
    }
    return CustomConfig;
  });
}
