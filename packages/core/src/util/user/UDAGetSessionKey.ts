//getting session key from backend server
import {ENDPOINT} from "../../config/endpoints";
import {UDASessionData} from "../../models/UDASessionData";
import {apiClient, ApiClient} from "../../services";

export const UDAGetSessionKey = async (UDASessionData: UDASessionData) => {
  let response = await apiClient.get(ENDPOINT.GetSessionKey);
  if(!response){
    return response;
  }

  UDASessionData.sessionKey = response.data;
  return UDASessionData;
}
