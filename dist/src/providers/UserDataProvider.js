import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from "react";
import { UserDataContext } from "./UserDataContext";
/**
 * used for global reference
 */
export const SetUserDataContext = createContext('');
const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const changeUserData = (data) => {
        setUserData(data);
    };
    return (_jsx(UserDataContext.Provider, Object.assign({ value: userData }, { children: _jsx(SetUserDataContext.Provider, Object.assign({ value: changeUserData }, { children: children })) })));
};
export default UserDataProvider;
//# sourceMappingURL=UserDataProvider.js.map