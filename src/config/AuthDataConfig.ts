import {AuthConfig, AuthConfigPropTypes} from "./UserAuthConfig";
import {UDADigestMessage} from "../util/UDADigestMessage";
import {trigger} from "../util/events";

//Setting the custom variable
export const AuthDataConfig  = async (data: AuthConfigPropTypes) => {
  const oldData = {...AuthConfig};
  for(const [key, value] of Object.entries(AuthConfig)) {
    if(data[key] !== undefined) {
      if(data[key] === '') {
        AuthConfig[key] = data[key];
      } else if(typeof AuthConfig[key] === typeof data[key]) {
        let encrypted = await UDADigestMessage(data[key], 'SHA-512');
        AuthConfig[key] = encrypted;
      } else {
        console.log(key + ' accepts only '+typeof AuthConfig[key]+' data type.');
      }
    }
  }
  console.log(oldData);
  if(AuthConfig.id === '' || (oldData.id !== '' && oldData.id !== AuthConfig.id)){
    trigger('UDAClearSessionData', {});
  } else if(AuthConfig.id !== ''){
    trigger("RequestUDASessionData", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
  }
  return AuthConfig;
}
