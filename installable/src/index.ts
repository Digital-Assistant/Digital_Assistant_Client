import {ValidateConfig} from "./config/ValidateConfig";
import {CustomConfig, CustomConfigPropTypes} from "./config/CustomConfig";
import udanStore from "./udanStore";

// export const UDAPluginSDK: any = AppConfig;
// export const UDAGlobalConfig: CustomConfigPropTypes = CustomConfig;
const Udan = {
    convertToUpper: (s1: string) => {
        return s1.toUpperCase().toString();
    },
    currentValues: () => {
        console.log(CustomConfig);
    },
    udanStore: ()=> {return udanStore();},
    unsubscribe: () => udanStore.subscribe((state: any) => {
        console.log('State changed:', state.UDAGlobalConfig);
        // Perform any desired actions based on the state change
    })
}

export default Udan;