import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  authManager,
  StorageUtil,
  CONFIG,
  on,
  off,
  trigger,
  setUserData,
  setAuthToken,
  clearAuthToken,
  setAuthTokenRenewer,
  type HostAuthToken,
} from "@udan/digital-assistant-sdk";
import { coreSDK as DigitalAssistantCoreSDK } from "../services/coreSDK";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: () => void;
  logout: () => void;
  user: any;
  /** Plain-words reason the last sign-in did not work (or the session ended); null when there is none. */
  authMessage: string | null;
  /** True from the Sign-in press until the worker answers. */
  signingIn: boolean;
  /** Changes when the environment or a backend/realm setting of the SDK changes; effects that fetch data depend on it. */
  configVersion: number;
}

/** The SDK settings that decide which backend and realm a session belongs to. */
const SESSION_CONFIG_KEYS = ["environment", "apiBaseUrl", "tokenUrl", "llmUrl", "keycloakUrl", "realm", "clientId"];

function sessionConfigSignature(): string {
  const config = (typeof window !== "undefined" ? (window as any).UDAGlobalConfig : undefined) || {};
  return JSON.stringify(SESSION_CONFIG_KEYS.map((key) => config[key] ?? ""));
}

/**
 * The `UDAAlertMessageData` codes that carry a message for the user, from the worker (Background.ts) or the
 * content script (ExtensionSDK.js, when the worker cannot answer). "login" only means "not signed in".
 */
const AUTH_MESSAGES: Record<string, string> = {
  "signin-no-identity": "No Chrome profile is signed in, so there is nothing to sign in with. Sign in to Chrome with your Google account, then press Sign in again.",
  "signin-cancelled": "Sign-in was cancelled. Press Sign in to try again.",
  "signin-failed": "Sign-in did not work. Please try again.",
  "signin-network": "Could not reach the sign-in service. Check your connection and try again.",
  "signin-reload": "The extension was updated or reloaded. Reload this page, then press Sign in again.",
  "session-expired": "Your session has expired. Please sign in again.",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_WAIT_MS = 20_000;

/** Asks the worker (through the content script) for a fresh Keycloak access token; null if signed out. */
function requestAccessToken(): Promise<HostAuthToken | null> {
  return new Promise((resolve) => {
    const done = (value: HostAuthToken | null) => {
      clearTimeout(timer);
      document.removeEventListener("UDAAccessTokenData", onAnswer);
      resolve(value);
    };
    const onAnswer = (event: Event) => {
      const data = (event as CustomEvent).detail?.data;
      done(data?.token ? { token: data.token, expiresAt: data.expiresAt, authsource: "keycloak" } : null);
    };
    const timer = setTimeout(() => done(null), ACCESS_TOKEN_WAIT_MS);
    document.addEventListener("UDAAccessTokenData", onAnswer);
    trigger("UDARequestAccessToken", { detail: {}, bubbles: false, cancelable: false });
  });
}

/**
 * A session from the worker's Keycloak sign-in carries the access token only. The SDK sends it on
 * every call and asks the worker for a new one before it expires (SDK host-token API); the refresh
 * token stays in the worker. Sessions of the Chrome identity flow are left to the SDK as before.
 */
function applySessionToken(session: unknown) {
  let parsed: any = session;
  if (typeof session === "string") {
    try { parsed = JSON.parse(session); } catch { return; }
  }
  const auth = parsed?.authData;
  if (parsed?.authenticationSource !== "keycloak" || typeof auth?.token !== "string") return;
  try {
    setAuthToken({ token: auth.token, expiresAt: Number.isFinite(auth.expiresAt) ? auth.expiresAt : undefined, authsource: "keycloak" });
    setAuthTokenRenewer(requestAccessToken);
  } catch (error) {
    console.warn("UDA: the session's access token was not usable:", (error as Error)?.message);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [configVersion, setConfigVersion] = useState(0);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const createSession = useCallback(async (data: any) => {
    setAuthMessage(null);
    setSigningIn(false);
    StorageUtil.setToStore(data.detail.data, CONFIG.USER_AUTH_DATA_KEY, true);
    applySessionToken(data.detail.data);
    setIsAuthenticated(true);
    setUser(data.detail.data);
    DigitalAssistantCoreSDK.dispatch(setUserData(data.detail.data));
  }, []);

  const clearSession = useCallback(async () => {
    clearAuthToken();
    await authManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    // Do NOT trigger RequestUDASessionData here — that causes a retry loop on 401
  }, []);

  // The worker says why a sign-in did not complete, or that the session ended
  const onAlert = useCallback((event: any) => {
    const code = event?.detail?.data;
    // in the extension the worker answers a Sign-in press; the page's own "login" (AuthService, sent
    // at once for every press) is not that answer and must not end "Signing in…"
    if (code === "login" && document.documentElement.hasAttribute("data-udan-extension")) return;
    setSigningIn(false);
    const text = typeof code === "string" ? AUTH_MESSAGES[code] : undefined;
    if (!text) return;
    if (code === "session-expired") clearSession();
    setAuthMessage(text);
  }, []);

  useEffect(() => {
    // No Keycloak check-sso on load: sign-in runs in the worker (Chrome identity or Keycloak PKCE) on the Sign-in button

    // Check existing session
    const checkAuth = async () => {
      try {
        if (authManager.isAuthenticated()) {
          const sessionData = authManager.getSessionData();
          if (sessionData && !isAuthenticated) {
            setIsAuthenticated(true);
            setUser(sessionData);
            trigger("CreateUDASessionData", {
              detail: { action: "createSession", data: sessionData },
              bubbles: false,
              cancelable: false,
            });
          }
        }

        let userSessionData = StorageUtil.getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
        if (userSessionData) {
          applySessionToken(userSessionData);
          setUser(userSessionData);
          setIsAuthenticated(true);
          DigitalAssistantCoreSDK.dispatch(setUserData(userSessionData));
        } else {
          // Request session data if not found
          trigger("RequestUDASessionData", {
            detail: { data: "getusersessiondata" },
            bubbles: false,
            cancelable: false,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    }

    checkAuth();

    // Event Listeners
    on("UDAUserSessionData", createSession);
    on("UDAAuthenticatedUserSessionData", createSession);
    on("UDAClearSessionData", clearSession);
    on("UDAGetNewToken", clearSession);
    on("UDAAlertMessageData", onAlert);

    // Subscribe to SDK state changes
    const unsubscribe = DigitalAssistantCoreSDK.subscribe(async (state) => {
      const keycloakData = state.user?.keycloakSessionData;
      if (keycloakData && !isAuthenticated) {
        const sessionData = authManager.getSessionData();
        if (sessionData) {
          setIsAuthenticated(true);
          setUser(sessionData);
          trigger("CreateUDASessionData", {
            detail: { action: "createSession", data: sessionData },
            bubbles: false,
            cancelable: false,
          });
        }
      }
    });

    return () => {
      off("UDAUserSessionData", createSession);
      off("UDAAuthenticatedUserSessionData", createSession);
      off("UDAClearSessionData", clearSession);
      off("UDAGetNewToken", clearSession);
      off("UDAAlertMessageData", onAlert);
      unsubscribe();
    };
  }, []); // run once on mount only — isAuthenticated changes must not re-register listeners

  // The environment (TEST/PROD) or a backend/realm setting changed after the panel mounted (options
  // override, host page UDAPluginSDK call): the stored session belongs to the old backend. Drop it,
  // ask the worker for the session of the new one and let the search run again (configVersion).
  useEffect(() => {
    let signature = sessionConfigSignature();
    const onConfigUpdated = () => {
      const next = sessionConfigSignature();
      if (next === signature) return;
      signature = next;
      try {
        window.localStorage.removeItem(CONFIG.USER_AUTH_DATA_KEY);
      } catch {
        // storage not available: the worker answer below replaces the session anyway
      }
      setIsAuthenticated(false);
      setUser(null);
      setConfigVersion((version) => version + 1);
      trigger("RequestUDASessionData", {
        detail: { data: "getusersessiondata" },
        bubbles: false,
        cancelable: false,
      });
    };
    window.addEventListener("UDAConfigUpdated", onConfigUpdated);
    return () => window.removeEventListener("UDAConfigUpdated", onConfigUpdated);
  }, []);

  // Sign-in asks the worker to sign in: Chrome identity if the browser has one (LoginWithBrowser), else the
  // Keycloak sign-in (LoginWithKeycloak, may open a sign-in window); the worker answers with the session
  const login = () => {
    setAuthMessage(null);
    setSigningIn(true);
    trigger("RequestUDASessionData", {
      detail: { data: "UDASignIn" },
      bubbles: false,
      cancelable: false,
    });
  };

  // Sign-out also ends the worker's session (and the Keycloak session, if any)
  const logout = () => {
    setAuthMessage(null);
    clearSession();
    trigger("RequestUDASessionData", {
      detail: { data: "UDASignOut" },
      bubbles: false,
      cancelable: false,
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout, user, authMessage, signingIn, configVersion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
