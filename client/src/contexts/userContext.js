import { useImmer } from "use-immer";
import { createContext, useEffect, useState } from "react";
import api from "src/api/api";
import config from "src/config";

export const UserContext = createContext(null);
export const UserLoadingContext = createContext(true);
export const UpdateUserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // user state
  const [user, updateUser] = useImmer(null);
  const [loading, setLoading] = useState(true);

  // fetch user if already logged in
  useEffect(() => {
    (async () => {
      // try to load user
      try {
        const fetched_user = await api.users.get();
        updateUser((user) => fetched_user);
        setLoading(false);
      } catch (err) {
        // if unauthorized
        setLoading(false);
      }
    })();
  }, [updateUser]);

  return (
    <UserContext.Provider value={user}>
      <UpdateUserContext.Provider value={updateUser}>
        <UserLoadingContext.Provider value={loading}>
          {children}
        </UserLoadingContext.Provider>
      </UpdateUserContext.Provider>
    </UserContext.Provider>
  );
};
