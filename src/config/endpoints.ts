/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */
const base = process.env.baseURL;

export const ENDPOINT = {
  CheckUserId: `${base}/user/checkauthid`,
  GetSessionKey: `${base}/user/getsessionkey`,
  CheckUserSession: `${base}/user/checkusersession`,
  Search: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#`,
  SearchWithPermissions: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#`,
  ProfanityCheck: `https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen`,
  SpecialNodes: `${base}/clickevents`,
  Record: `${base}/user/clickednode`,
  UpdateRecord: `${base}/user/updateclickednode`,
  RecordSequence: `${base}/clickevents/recordsequencedata`,
  UserClick: `${base}/clickevents/userclick`,
  DeleteSequence: `${base}/clickevents/sequence/delete`,
  VoteRecord: `${base}/clickevents/sequence/addvote`,
};
