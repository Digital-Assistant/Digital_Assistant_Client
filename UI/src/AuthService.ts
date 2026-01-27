// Migrated to use @digital-assistant/core package
import {
    getUDASessionName,
    updateSessionName,
    updateBrowserPlugin,
    UDAGetSessionKey,
    UDASendSessionData,
    UDABindAuthenticatedAccount,
    CONFIG,
    AuthDataConfig,
    AuthConfig,
    keyCloakStore,
    on,
    UDAStorageService,
    UDASessionData,
    CustomConfig,
    AppConfig
} from "@digital-assistant/core";

updateBrowserPlugin(false);
updateSessionName('web');

// Get UDASessionName from core package
const UDASessionName = getUDASessionName();

// export let sessionData: any = {sessionKey:"", authenticated:false, authenticationSource:"", authData:{}};
let sessionData: UDASessionData = new UDASessionData();

// global.UDAAuthDataConfig = AuthDataConfig;
// global.UDAAuthConfig = AuthConfig;
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
      // Use async storage instead of localStorage (service worker safe)
      await UDAStorageService.remove(UDASessionName);
      sessionData = await UDAGetSessionKey(sessionData);
      sessionData.authData.id = global.UDAAuthConfig.id;
      sessionData.authData.email = (global.UDAAuthConfig.email)?global.UDAAuthConfig.email:global.UDAAuthConfig.id;
      sessionData.authenticated=true;
      // Use window.location safely (only in web context)
      sessionData.authenticationSource=(typeof window !== 'undefined' && window.location)?window.location.hostname:'unknown';
      await UDABindAuthenticatedAccount(sessionData, renewToken);
    } else {
      await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
    }
  } else if(typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
    sessionData = await UDAGetSessionKey(sessionData);
    sessionData.authData.id = global.UDAAuthConfig.id;
    sessionData.authData.email = (global.UDAAuthConfig.email)?global.UDAAuthConfig.email:global.UDAAuthConfig.id;
    sessionData.authenticated=true;
    // Use window.location safely (only in web context)
    sessionData.authenticationSource=(typeof window !== 'undefined' && window.location)?window.location.hostname:'unknown';
    await UDABindAuthenticatedAccount(sessionData, renewToken);
  } else if (global.UDAAuthConfig.id === '') {
    await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
  }
}

/**
 * Clearing Session storage
 * Updated to use async storage (service worker safe)
 */
export const UDAClearSession = async () => {
  // Use async storage instead of localStorage (service worker safe)
  await UDAStorageService.remove(UDASessionName);
  sessionData = new UDASessionData();
}
