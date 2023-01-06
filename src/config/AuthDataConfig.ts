import {AuthConfig, AuthConfigPropTypes} from "./UserAuthConfig";
import {UDADigestMessage} from "../util/UDADigestMessage";
import {trigger} from "../util/events";

//Setting the custom variable
export const AuthDataConfig  = async (data: AuthConfigPropTypes) => {
  for(const [key, value] of Object.entries(AuthConfig)) {
    if(data[key] !== undefined && data[key]) {
      if(typeof AuthConfig[key] === typeof data[key]) {
        let encrypted = await UDADigestMessage(data[key], 'SHA-512');
        AuthConfig[key] = encrypted;
      } else {
        console.log(key + ' accepts only '+typeof AuthConfig[key]+' data type.');
      }
    }
  }
  if(AuthConfig.id === ''){
    trigger('UDAClearSessionData', {});
  }
  return AuthConfig;
}
