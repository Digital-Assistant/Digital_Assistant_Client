/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */

export const ENDPOINT = {
  CheckUserId: `/user/checkauthid`,
  GetSessionKey: `/user/getsessionkey`,
  CheckUserSession: `/user/checkusersession`,
  Search: `/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#`,
  SearchWithPermissions: `/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#`,
  ProfanityCheck: `https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen`,
  SpecialNodes: `/clickevents`,
  Record: `/user/clickednode`,
  UpdateRecord: `/user/updateclickednode`,
  RecordSequence: `/clickevents/recordsequencedata`,
  UserClick: `/clickevents/userclick`,
  DeleteSequence: `/clickevents/sequence/delete`,
  VoteRecord: `/clickevents/sequence/addvote`,
};
