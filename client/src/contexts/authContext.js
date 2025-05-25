import { useImmer } from "use-immer";
import { createContext } from "react";

export const UserContext = createContext(null);
export const UpdateUserContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user state
  const [user, updateUser] = useImmer(null);

  return (
    <UserContext.Provider value={user}>
      <UpdateUserContext.Provider value={updateUser}>
        {children}
      </UpdateUserContext.Provider>
    </UserContext.Provider>
  );
};
