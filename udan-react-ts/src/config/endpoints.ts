/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */
import { environment } from "../../environments/environment";

const base = environment.baseURL;

export const ENDPOINT = {
  USER_LOGIN: `${base}/user/checkauthid`,
  GET_USER_SESSION: `${base}/user/getsessionkey`,
  SEARCH: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#`,
  RECORD: `${base}/user/clickednode`,
  RECORD_SEQUENCE: `${base}/clickevents/recordsequencedata`,
  USER_CLICK: `${base}/clickevents/userclick`,
  DELETE_SEQUENCE: `${base}/clickevents/sequence/delete`,
  VOTE_RECORD: `${base}/clickevents/sequence/addvote`,
};
