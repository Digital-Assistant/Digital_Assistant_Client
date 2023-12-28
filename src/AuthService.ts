import {UDASessionName, updateSessionName, updateBrowserPlugin} from "./BrowserConstants";

updateBrowserPlugin(false);
updateSessionName('web');

// export let sessionData: any = {sessionKey:"", authenticated:false, authenticationSource:"", authData:{}};
let sessionData: UDASessionData = new UDASessionData();

import {UDAGetSessionKey} from "./util/UDAGetSessionKey";
import {UDASendSessionData} from "./util/UDASendSessionData";
import {UDABindAuthenticatedAccount} from "./util/UDABindAuthenticatedAccount";
import {CONFIG} from "./config";
import {AuthDataConfig} from "./config/AuthDataConfig";
import {AuthConfig} from "./config/UserAuthConfig";

import {keyCloakStore} from "./util/KeycloakStore";
import {on} from "./util/events";
import {UDAStorageService} from "./services/UDAStorageService";
import {UDASessionData} from "./models/UDASessionData";
import {CustomConfig} from "./config/CustomConfig";
import {AppConfig} from "./config/AppConfig";

global.UDAAuthDataConfig = AuthDataConfig;
global.UDAAuthConfig = AuthConfig;
global.UDAPluginSDK = AppConfig;
global.UDAGlobalConfig = CustomConfig;

// Clearing user session in case if the id gets changed
on("UDAClearSessionData", async () => {
  await UDAStorageService.remove(UDASessionName);
});

// listening to the requests that is sent by the sdk.
on("RequestUDASessionData", async (data: any) => {
  let action=data.detail.data;
  if(action === "getusersessiondata" && global.UDAGlobalConfig.realm!=='UDAN')
  {
    let storedSessionData = await UDAStorageService.get(UDASessionName);
    //	check for change in id
    await UDACheckUserSessionData(storedSessionData);
  } else {
    await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
  }
});

on('CreateUDASessionData',async (data) => {
  await keyCloakStore(sessionData, data.detail.data);
});

on('UDAGetNewToken',async (data) => {
  let storedSessionData = await UDAStorageService.get(UDASessionName);
  //	check for change in id
  await UDACheckUserSessionData(storedSessionData, false, true);
});

export const UDACheckUserSessionData = async (storedSessionData, getSession: boolean = true, renewToken: boolean = false) => {
  storedSessionData=JSON.parse(storedSessionData);
  if(storedSessionData !== null && storedSessionData.hasOwnProperty("sessionKey") && storedSessionData.sessionKey && storedSessionData.authData){
    if(typeof global.UDAAuthConfig!='undefined' && global.UDAAuthConfig.id && (storedSessionData.authData.hasOwnProperty('id') && storedSessionData.authData.id === global.UDAAuthConfig.id)){
      sessionData=storedSessionData;
      if(sessionData.authData.token && !renewToken) {
        await UDASendSessionData(sessionData);
      } else {
        await UDABindAuthenticatedAccount(sessionData, renewToken);
      }
    } else if(getSession && typeof global.UDAAuthConfig!=='undefined' && global.UDAAuthConfig.id){
      window.localStorage.removeItem(UDASessionName);
      sessionData = await UDAGetSessionKey(sessionData);
      sessionData.authData.id = global.UDAAuthConfig.id;
      sessionData.authData.email = (global.UDAAuthConfig.email)?global.UDAAuthConfig.email:global.UDAAuthConfig.id;
      sessionData.authenticated=true;
      sessionData.authenticationSource=window.location.hostname;
      await UDABindAuthenticatedAccount(sessionData, renewToken);
    } else {
      await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
    }
  } else if(typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
    sessionData = await UDAGetSessionKey(sessionData);
    sessionData.authData.id = global.UDAAuthConfig.id;
    sessionData.authData.email = (global.UDAAuthConfig.email)?global.UDAAuthConfig.email:global.UDAAuthConfig.id;
    sessionData.authenticated=true;
    sessionData.authenticationSource=window.location.hostname;
    await UDABindAuthenticatedAccount(sessionData, renewToken);
  } else if (global.UDAAuthConfig.id === '') {
    await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
  }
}

/**
 * Clearing Session storage
 */
export const UDAClearSession= () => {
  window.localStorage.removeItem(UDASessionName);
  sessionData=new UDASessionData();
}
