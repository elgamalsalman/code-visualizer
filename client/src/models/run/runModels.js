const runStatuses = {
  connecting: "connecting",
  compiling: "compiling",
  running: "running",
  killed: "killed",
  success: "success",
  failed: "failed",
};

const runPendingStatuses = [
  runStatuses.connecting,
  runStatuses.compiling,
  runStatuses.running,
];
const runDoneStatuses = [
  runStatuses.killed,
  runStatuses.success,
  runStatuses.failed,
];

const getRun = (id, startTime, status = runStatuses.connecting) => {
  return {
    id: id,
    data: [],
    startTime: startTime,
    endTime: null,
    status: status,
    error: null,
  };
};

export { runStatuses, runPendingStatuses, runDoneStatuses, getRun };
