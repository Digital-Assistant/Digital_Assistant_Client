//getting session key from backend server
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";
import {UDASessionData} from "../models/UDASessionData";

export const UDAGetSessionKey = async (UDASessionData: UDASessionData) => {
  let response = await invokeApi(ENDPOINT.GetSessionKey, "GET", null, false);
  if(!response){
    return response;
  }

  UDASessionData.sessionKey = response;
  return UDASessionData;
}
