import {UDAGetSessionKey} from "./util/UDAGetSessionKey";
import {UDASendSessionData} from "./util/UDASendSessionData";
import {UDABindAuthenticatedAccount} from "./util/UDABindAuthenticatedAccount";
import {CONFIG} from "./config";
import {AuthDataConfig} from "./config/AuthDataConfig";
import {AuthConfig} from "./config/UserAuthConfig";

import {keyCloakStore} from "./util/KeycloakStore";
import {on} from "./util/events";

global.UDAAuthDataConfig = AuthDataConfig;
global.UDAAuthConfig = AuthConfig;

export const UDAApiHost=CONFIG.UDA_DOMAIN;
export const UDASessionName=CONFIG.USER_AUTH_DATA_KEY+'-web';
export let UDASessionData: any = {sessionkey:"", authenticated:false, authenticationsource:"", authdata:{}};

// Clearing user session in case if the id gets changed
on("UDAClearSessionData", () => {
  UDAClearSession();
});

// listening to the requests that is sent by the sdk.
on("RequestUDASessionData", async (data: any) => {
  let action=data.detail.data;
  if(action === "getusersessiondata")
  {
    let storedSessionData = window.localStorage.getItem(UDASessionName);
    //	check for change in id
    await UDACheckUserSessionData(storedSessionData);
  }
});

on('CreateUDASessionData',async (data) => {
  await keyCloakStore(UDASessionData, data.detail.data);
});

export const UDACheckUserSessionData = async (storedSessionData, getSession=true) => {
  storedSessionData=JSON.parse(storedSessionData);
  if(storedSessionData !== null && storedSessionData.hasOwnProperty("sessionkey") && storedSessionData.sessionkey && storedSessionData.authdata){
    if(typeof global.UDAAuthConfig!='undefined' && global.UDAAuthConfig.id && (storedSessionData.authdata.hasOwnProperty('id') && storedSessionData.authdata.id === global.UDAAuthConfig.id)){
      UDASessionData=storedSessionData;
      UDASendSessionData(UDASessionData);
    } else if(getSession && typeof global.UDAAuthConfig!=='undefined' && global.UDAAuthConfig.id){
      window.localStorage.removeItem(UDASessionName);
      UDASessionData = await UDAGetSessionKey(UDASessionData);
      UDASessionData.authdata = global.UDAAuthConfig;
      UDASessionData.authenticated=true;
      UDASessionData.authenticationsource=window.location.hostname;
      await UDABindAuthenticatedAccount(UDASessionData);
    } else {
      UDASendSessionData(UDASessionData, "UDAAlertMessageData", "login")
    }
  } else if(typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
    UDASessionData = await UDAGetSessionKey(UDASessionData);
    UDASessionData.authdata = global.UDAAuthConfig;
    UDASessionData.authenticated=true;
    UDASessionData.authenticationsource=window.location.hostname;
    await UDABindAuthenticatedAccount(UDASessionData);
  } else if (global.UDAAuthConfig.id === '') {
    UDASendSessionData(UDASessionData, "UDAAlertMessageData", "login")
  }
}

//storing the data to local storage
export const UDAStoreSessionData = (udaSessionData) => {
  const storageData = JSON.stringify(udaSessionData);
  window.localStorage.setItem(UDASessionName, storageData);
  UDASessionData = udaSessionData;
}

/**
 * Clearing Session storage
 */
export const UDAClearSession= () => {
  window.localStorage.removeItem(UDASessionName);
  UDASessionData={sessionkey: null, authenticated:false, authenticationsource: null, authdata:{}};
}
