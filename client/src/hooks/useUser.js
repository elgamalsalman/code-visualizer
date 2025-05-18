import { useContext } from "react";
import { UserContext, UpdateUserContext } from "src/contexts/authContext";

const useUser = () => {
  const user = useContext(UserContext);
  const updateUser = useContext(UpdateUserContext);
  return [user, updateUser];
};

export default useUser;
