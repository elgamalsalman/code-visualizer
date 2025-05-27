import { useContext } from "react";
import {
  UserContext,
  UpdateUserContext,
  UserLoadingContext,
} from "src/contexts/userContext";

const useUser = () => {
  const user = useContext(UserContext);
  const updateUser = useContext(UpdateUserContext);
  const userLoading = useContext(UserLoadingContext);
  return [user, updateUser, userLoading];
};

export default useUser;
