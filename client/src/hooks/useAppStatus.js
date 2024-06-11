import { useSelector } from "react-redux";

const useAppStatus = () => {
  return useSelector((state) => {
    return state.app.status;
  });
};

export default useAppStatus;
