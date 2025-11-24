
import reducer, {
  UserState,
  setUserData,
  setUserSessionData,
  setKeycloakSessionData,
  clearUserData,
  setUserSessionId,
} from '../userSlice';

describe('userSlice', () => {
  const initialState: UserState = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setUserData', () => {
    const authData = { id: '123', email: 'test@example.com' };
    const newState = reducer(initialState, setUserData(authData));
    expect(newState.userData).toEqual(authData);
    // userSessionData should also be set if it was undefined
    expect(newState.userSessionData?.authData).toEqual(authData);
  });

  it('should handle setUserData when userSessionData already exists', () => {
    const existingSessionData = { sessionKey: 'abc' };
    const currentState: UserState = { userSessionData: existingSessionData };
    const authData = { id: '123', email: 'test@example.com' };
    const newState = reducer(currentState, setUserData(authData));
    expect(newState.userData).toEqual(authData);
    // userSessionData should retain its existing value, only authData within it is updated
    expect(newState.userSessionData).toEqual(existingSessionData);
  });

  it('should handle setUserSessionData', () => {
    const sessionData = { authData: { token: 'xyz' }, sessionKey: '123' };
    const newState = reducer(initialState, setUserSessionData(sessionData));
    expect(newState.userSessionData).toEqual(sessionData);
  });

  it('should handle setKeycloakSessionData', () => {
    const keycloakData = { id: 'k1', token: 'k_token' };
    const newState = reducer(initialState, setKeycloakSessionData(keycloakData));
    expect(newState.keycloakSessionData).toEqual(keycloakData);
  });

  it('should handle clearUserData', () => {
    const currentState: UserState = {
      userData: { id: '123' },
      userSessionData: { sessionKey: 'abc' },
      keycloakSessionData: { id: 'k1' },
      userSessionId: 'session_id',
    };
    const newState = reducer(currentState, clearUserData());
    expect(newState.userData).toBeUndefined();
    expect(newState.userSessionData).toBeUndefined();
    expect(newState.keycloakSessionData).toBeUndefined();
    expect(newState.userSessionId).toBeUndefined();
  });

  it('should handle setUserSessionId', () => {
    const sessionId = 'new_session_id';
    const newState = reducer(initialState, setUserSessionId(sessionId));
    expect(newState.userSessionId).toBe(sessionId);
  });

  it('should handle partial authData in setUserData', () => {
    const partialAuthData = { email: 'partial@example.com' };
    const newState = reducer(initialState, setUserData(partialAuthData));
    expect(newState.userData).toEqual(partialAuthData);
    expect(newState.userSessionData?.authData).toEqual(partialAuthData);
  });

  it('should not modify other state properties when one is updated', () => {
    const currentState: UserState = {
      userData: { id: 'old_id' },
      userSessionId: 'existing_session',
    };
    const keycloakData = { id: 'k1', token: 'k_token' };
    const newState = reducer(currentState, setKeycloakSessionData(keycloakData));
    expect(newState.keycloakSessionData).toEqual(keycloakData);
    expect(newState.userData).toEqual(currentState.userData); // Should remain unchanged
    expect(newState.userSessionId).toEqual(currentState.userSessionId); // Should remain unchanged
  });
});
