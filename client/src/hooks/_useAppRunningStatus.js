import { useSelector } from "react-redux";

import { runStatuses, runDoneStatuses } from "src/models/run/runModels";
import { appStatuses } from "src/models/appInfo/appInfoModels";

const useRunningStatus = () => {
  return useSelector((state) => {
    const runsLength = state.runs.length;
    if (runsLength > 0) {
      const lastRun = state.runs[runsLength - 1];
      if (runDoneStatuses.includes(lastRun.status)) {
        return appStatuses.idle;
      } else if (lastRun.status === runStatuses.running) {
        return appStatuses.running;
      } else {
        return appStatuses.pending;
      }
    } else {
      return appStatuses.idle;
    }
  });
};

export default useRunningStatus;
