import { useContext } from "react";
import {
  AppStatusContext,
  SetAppStatusContext,
} from "src/contexts/appStatusContext";

const useAppStatusContext = () => {
  const appStatus = useContext(AppStatusContext);
  const setAppStatus = useContext(SetAppStatusContext);
  return [appStatus, setAppStatus];
};

export { useAppStatusContext };
