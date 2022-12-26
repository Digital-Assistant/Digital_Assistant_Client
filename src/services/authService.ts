import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";
// import { getFromStore } from "../util";

/**
 * To get the session
 * @param request
 * @returns promise
 */

export const getUserSession = (request?: any) => {
  const parameters = {
    url: ENDPOINT.GET_USER_SESSION,
    method: "GET",
    responseType: "text",
  };
  return REST.apiCal(parameters);
};

export const login = (udaUserData: any) => {
  if (!udaUserData) return;
  const authdata = {
    authid: udaUserData.authdata.id,
    emailid: udaUserData.authdata.email,
    authsource: udaUserData.authenticationsource,
  };
  const parameters = {
    url: ENDPOINT.USER_LOGIN,
    method: "POST",
    body: authdata,
  };
  return REST.apiCal(parameters);
};
