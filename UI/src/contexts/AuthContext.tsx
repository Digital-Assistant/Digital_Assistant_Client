import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  authManager,
  StorageUtil,
  CONFIG,
  on,
  off,
  trigger,
  setUserData
} from "@digital-assistant/core";
import { coreSDK as DigitalAssistantCoreSDK } from "../services/coreSDK";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: () => void;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);

  const createSession = useCallback(async (data: any) => {
    StorageUtil.setToStore(data.detail.data, CONFIG.USER_AUTH_DATA_KEY, true);
    setIsAuthenticated(true);
    setUser(data.detail.data);
    DigitalAssistantCoreSDK.dispatch(setUserData(data.detail.data));
    // Toggle panel logic is not directly applicable here as we are in the panel UI itself, 
    // but we might need to notify other parts of the app.
  }, []);

  const clearSession = useCallback(async () => {
    await StorageUtil.remove(CONFIG.USER_AUTH_DATA_KEY);
    await StorageUtil.remove(CONFIG.UDAKeyCloakKey);
    await StorageUtil.remove(CONFIG.SELECTED_RECORDING);
    setIsAuthenticated(false);
    setUser(null);
    trigger("RequestUDASessionData", {
      detail: { data: "getusersessiondata" },
      bubbles: false,
      cancelable: false,
    });
  }, []);

  useEffect(() => {
    // Initialize AuthManager
    authManager.init();

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
  }, [isAuthenticated, createSession, clearSession]);

  const login = () => {
    authManager.init();
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout, user }}>
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
