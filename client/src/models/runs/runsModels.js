const runStatuses = {
  waiting: "waiting",
  connecting: "connecting",
  compiling: "compiling",
  running: "running",
  success: "success",
  failed: "failed",
};

const runPendingStatuses = [
  runStatuses.waiting,
  runStatuses.connecting,
  runStatuses.compiling,
  runStatuses.running,
];
const runDoneStatuses = [runStatuses.success, runStatuses.failed];

const getNewRun = (id, startTime) => {
  return {
    id: id,
    data: [],
    startTime: startTime,
    endTime: null,
    status: runStatuses.waiting,
  };
};

export { runStatuses, runPendingStatuses, runDoneStatuses, getNewRun };
