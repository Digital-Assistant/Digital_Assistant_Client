import {AuthConfig, AuthConfigPropTypes} from "./UserAuthConfig";
import {UDADigestMessage} from "./UDADigestMessage";
import {trigger} from "../node/events";
import {UDAConsoleLogger} from "../error";


//Setting the custom variable
export const AuthDataConfig  = async (data: AuthConfigPropTypes) => {
  const oldData: any = {...AuthConfig};
  const config = AuthConfig as any;
  const authData = data as any;

  for(const key of Object.keys(AuthConfig)) {
    if(authData[key] !== undefined) {
      if(authData[key] === '') {
        config[key] = authData[key];
      } else if(typeof config[key] === typeof authData[key]) {
        let encrypted: any = await UDADigestMessage(authData[key], 'SHA-512');
        UDAConsoleLogger.info(encrypted);
        config[key] = encrypted;
      } else {
        console.log(key + ' accepts only '+typeof config[key]+' data type.');
      }
    }
  }

  if(AuthConfig.id === '' || (oldData.id !== '' && oldData.id !== AuthConfig.id)){
    trigger('UDAClearSessionData', {});
  } else if(AuthConfig.id !== ''){
    trigger("RequestUDASessionData", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
  }
  return AuthConfig;
}
