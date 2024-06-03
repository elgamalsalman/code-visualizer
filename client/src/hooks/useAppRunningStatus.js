import { useSelector } from "react-redux";

import { runStatuses, runDoneStatuses } from "src/models/runs/runsModels";
import { appRunningStatuses } from "src/models/appInfo/appInfoModels";

const useRunningStatus = () => {
  return useSelector((state) => {
    const runsLength = state.runs.length;
    if (runsLength > 0) {
      const lastRun = state.runs[runsLength - 1];
      if (runDoneStatuses.includes(lastRun.status)) {
        return appRunningStatuses.idle;
      } else if (lastRun.status === runStatuses.running) {
        return appRunningStatuses.running;
      } else {
        return appRunningStatuses.pending;
      }
    } else {
      return appRunningStatuses.idle;
    }
  });
};

export default useRunningStatus;
