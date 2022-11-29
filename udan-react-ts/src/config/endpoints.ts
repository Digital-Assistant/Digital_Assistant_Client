/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */
const base = process.env.baseURL;

export const ENDPOINT = {
  USER_LOGIN: `${base}/user/checkauthid`,
  GET_USER_SESSION: `${base}/user/getsessionkey`,
  SEARCH: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#`,
  SEARCH_WITH_PERMISSIONS: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#`,
  PROFANITY_CHECK: `https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen`,
  SPECIAL_NODES: `${base}/clickevents`,
  RECORD: `${base}/user/clickednode`,
  UPDATE_RECORD: `${base}/user/updateclickednode`,
  RECORD_SEQUENCE: `${base}/clickevents/recordsequencedata`,
  USER_CLICK: `${base}/clickevents/userclick`,
  DELETE_SEQUENCE: `${base}/clickevents/sequence/delete`,
  VOTE_RECORD: `${base}/clickevents/sequence/addvote`,
};
