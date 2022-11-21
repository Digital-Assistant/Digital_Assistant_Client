import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

export const AppConfig  = (data: CustomConfigPropTypes) => {
  Object.keys(data).forEach((key, index)=> {
    if(CustomConfig[key] !== undefined) {
      if(key!=='permissions' && typeof data[key] === 'boolean')
        CustomConfig[key] = data[key];
    }
  });
  console.log(CustomConfig);
}
