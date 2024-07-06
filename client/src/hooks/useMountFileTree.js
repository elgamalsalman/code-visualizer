import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getEntityMeta } from "src/models/entity/entityModels";
import { updateFileTree } from "src/redux/fileTree/fileTreeSlice";
import { setAppStatus } from "src/redux/app/appSlice";
import { appStatuses } from "src/models/app/appModels";

const useMountFileTree = (fileTree) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (fileTree === null) return;
    dispatch(updateFileTree({ fileTree: fileTree }));
    dispatch(setAppStatus({ status: appStatuses.idle }));
  }, [fileTree]);
};

export default useMountFileTree;
