import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  authManager,
  StorageUtil,
  CONFIG,
  on,
  off,
  trigger,
  setUserData,
} from "@udan/digital-assistant-sdk";
import { coreSDK as DigitalAssistantCoreSDK } from "../services/coreSDK";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: () => void;
  logout: () => void;
  user: any;
  /** Changes when the environment or a backend/realm setting of the SDK changes; effects that fetch data depend on it. */
  configVersion: number;
}

/** The SDK settings that decide which backend and realm a session belongs to. */
const SESSION_CONFIG_KEYS = ["environment", "apiBaseUrl", "tokenUrl", "llmUrl", "keycloakUrl", "realm", "clientId"];

function sessionConfigSignature(): string {
  const config = (typeof window !== "undefined" ? (window as any).UDAGlobalConfig : undefined) || {};
  return JSON.stringify(SESSION_CONFIG_KEYS.map((key) => config[key] ?? ""));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [configVersion, setConfigVersion] = useState(0);

  const createSession = useCallback(async (data: any) => {
    StorageUtil.setToStore(data.detail.data, CONFIG.USER_AUTH_DATA_KEY, true);
    setIsAuthenticated(true);
    setUser(data.detail.data);
    DigitalAssistantCoreSDK.dispatch(setUserData(data.detail.data));
  }, []);

  const clearSession = useCallback(async () => {
    await authManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    // Do NOT trigger RequestUDASessionData here — that causes a retry loop on 401
  }, []);

  useEffect(() => {
    // No Keycloak check-sso on load: the real login is the Chrome identity flow in the worker

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

  // Sign-in asks the worker for the session; with no signed-in identity it starts LoginWithBrowser (Chrome identity)
  const login = () => {
    trigger("RequestUDASessionData", {
      detail: { data: "getusersessiondata" },
      bubbles: false,
      cancelable: false,
    });
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout, user, configVersion }}>
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
