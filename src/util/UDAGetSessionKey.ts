//getting session key from backend server
import {UDAApiHost, UDAStoreSessionData} from "../AuthService";
import {UDASendSessionData} from "./UDASendSessionData";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";

export const UDAGetSessionKey = async (UDASessionData) => {
  /*let xhr = new XMLHttpRequest();
  xhr.open("Get", UDAApiHost + "/user/getsessionkey", false);
  xhr.onload = function (event) {
    if (xhr.status === 200) {
      UDASessionData.sessionkey = xhr.response;
      UDAStoreSessionData(UDASessionData);
      UDASendSessionData(UDASessionData);
    }
  };
  xhr.send();*/

  let response = await invokeApi(ENDPOINT.GetSessionKey, "GET", null, false);
  if(!response){
    return response;
  }

  UDASessionData.sessionkey = response;
  return UDASessionData;
}
