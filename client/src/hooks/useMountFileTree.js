import { useDispatch } from "react-redux";
import { useContext, useEffect } from "react";
import { updateFileTree } from "src/redux/fileTree/fileTreeSlice";
import { appStatuses } from "src/models/app/appModels";
import { useAppStatusContext } from "./useAppStatusContext";

const useMountFileTree = (fileTree) => {
  const dispatch = useDispatch();
  const [appStatus, setAppStatus] = useAppStatusContext();
  useEffect(() => {
    if (fileTree === null) return;
    dispatch(updateFileTree({ fileTree: fileTree }));
    setAppStatus(appStatuses.idle);
  }, [fileTree]);
};

export default useMountFileTree;
