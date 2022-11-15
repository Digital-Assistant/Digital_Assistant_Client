import React, {createContext, useState} from "react";
import { UserDataContext } from "./UserDataContext";

/**
 * used for global reference
 */

export const SetUserDataContext: any = createContext('');

const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const changeUserData = (data) => {
    setUserData(data);
  };
  return (
          <UserDataContext.Provider value={userData}>
            <SetUserDataContext.Provider value={changeUserData}>
              {children}
            </SetUserDataContext.Provider>
          </UserDataContext.Provider>
  );
};

export default UserDataProvider;
