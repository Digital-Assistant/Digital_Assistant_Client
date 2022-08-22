/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */
import { environment } from "../../environments/environment";

const base = environment.baseURL;

export const ENDPOINT = {
  SEARCH: `${base}/clickevents/sequence/search?query=#keyword#&domain=#domain#`,
};
