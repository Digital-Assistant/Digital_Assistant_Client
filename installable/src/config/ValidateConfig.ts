import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

//Setting the custom variable
export const ValidateConfig  = async (data: CustomConfigPropTypes) => {
  const newConfig: CustomConfigPropTypes = CustomConfig;
  for (const key of Object.keys(CustomConfig)) {
    // @ts-ignore
    if(data[key] !== undefined) {
      // @ts-ignore
      if(typeof CustomConfig[key] === typeof data[key]) {
        // @ts-ignore
        newConfig[key] = data[key]
      } else {
        // @ts-ignore
        console.log(key + ' accepts only '+typeof CustomConfig[key]+' data type.');
      }
    }
  }
  console.log('Validated config ....');
  console.log(newConfig);
  return newConfig;
}
