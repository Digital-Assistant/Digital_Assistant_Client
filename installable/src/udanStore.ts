import create from 'zustand';
import {CustomConfig, CustomConfigPropTypes} from "./config/CustomConfig";
import {ValidateConfig} from "./config/ValidateConfig";

const udanStore = create((set) => ({
                        UDAGlobalConfig: CustomConfig,
                        UDAPluginSDK: async (data: CustomConfigPropTypes) => {
                            let newConfig = await ValidateConfig(data);
                            set((state: any) => ({UDAGlobalConfig: newConfig}))
                        }
                    }));

export default udanStore;