/**
 * Imports the AuthData and CSPData classes, which are used to represent authentication data and Content Security Policy data respectively.
 */
import { AuthData } from "./AuthData";
import { CSPData } from "./CSPData";

/**
 * Represents the data associated with a UDA (User Data Access) session.
 * This class contains information about the session, the user's authentication status, and related data such as authentication details and Content Security Policy information.
 */
export class UDASessionData {
  sessionKey: string;
  authenticated: boolean;
  authenticationSource: string;
  authData: AuthData;
  csp: CSPData;
  constructor(
    sessionKey: string = null,
    authenticated: boolean = false,
    authenticationSource: string = null,
    authData: AuthData = new AuthData(),
    csp: CSPData = new CSPData()
  ) {
    if (sessionKey === null) {
      throw new Error("Session key cannot be null.");
    }
    if (authenticated === null) {
      throw new Error("Authenticated cannot be null.");
    }
    if (authenticationSource === null) {
      throw new Error("Authentication source cannot be null.");
    }
    if (authData === null) {
      throw new Error("Authentication data cannot be null.");
    }
    if (csp === null) {
      throw new Error("Content Security Policy data cannot be null.");
    }
    this.sessionKey = sessionKey;
    this.authenticated = authenticated;
    this.authenticationSource = authenticationSource;
    this.authData = authData;
    this.csp = csp;
  }
}
