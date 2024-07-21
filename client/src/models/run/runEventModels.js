const runEventTypes = {
  connection: "connection",
  compilation: "compilation",
  stdin: "stdin",
  stdout: "stdout",
  stderr: "stderr",
  grapher: "grapher",
  error: "error",
  terminate: "terminate",
};

const runEventConsoleDataTypes = [
  runEventTypes.stdin,
  runEventTypes.stdout,
  runEventTypes.stderr,
];

const runEventDataTypes = [
  runEventTypes.stdin,
  runEventTypes.stdout,
  runEventTypes.stderr,
  runEventTypes.grapher,
];

const runEventStatuses = {
  success: "success",
  failed: "failed",
  killed: "killed",
};

const grapherEventTypes = {
  create: "create",
  change: "change",
  delete: "delete",
};

const getRunEvent = {
  connection: (status, error = "") => {
    if (status === runEventStatuses.success) {
      return {
        type: runEventTypes.connection,
        status: status,
      };
    } else if (status === runEventStatuses.failed) {
      return {
        type: runEventTypes.connection,
        status: status,
        error: error,
      };
    } else console.error(`Connecting with unknown status of ${status}`);
  },
  compilation: (status, error = "") => {
    if (status === runEventStatuses.success) {
      return {
        type: runEventTypes.compilation,
        status: status,
      };
    } else if (status === runEventStatuses.failed) {
      return {
        type: runEventTypes.compilation,
        status: status,
        error: error,
      };
    } else console.error(`Compiling with unknown status of ${status}`);
  },
  stdin: (data) => {
    return {
      type: runEventTypes.stdin,
      data: data,
    };
  },
  stdout: (data) => {
    return {
      type: runEventTypes.stdout,
      data: data,
    };
  },
  stderr: (data) => {
    return {
      type: runEventTypes.stderr,
      data: data,
    };
  },
  grapher: {
    create: (cls, id, props) => {
      return {
        type: runEventTypes.grapher,
        event: {
          type: grapherEventTypes.create,
          class: cls,
          id: id,
          props: props,
        },
      };
    },
    change: (cls, id, props) => {
      return {
        type: runEventTypes.grapher,
        event: {
          type: grapherEventTypes.change,
          class: cls,
          id: id,
          props: props,
        },
      };
    },
    delete: (cls, id) => {
      return {
        type: runEventTypes.grapher,
        event: {
          type: grapherEventTypes.delete,
          class: cls,
          id: id,
        },
      };
    },
  },
  error: (error) => {
    return {
      type: runEventTypes.error,
      error: error,
    };
  },
  terminate: (status) => {
    return {
      type: runEventTypes.terminate,
      status: status,
    };
  },
};

// assert valid file configuration
(() => {
  let valid = true;
  const runKeys1 = Object.keys(runEventTypes);
  const runKeys2 = Object.keys(getRunEvent);
  if (runKeys1.length !== runKeys2.length) valid = false;
  for (const runKey1 of runKeys1) {
    if (!runKeys2.includes(runKey1)) valid = false;
  }
  const grapherKeys1 = Object.keys(grapherEventTypes);
  const grapherKeys2 = Object.keys(getRunEvent.grapher);
  if (grapherKeys1.length !== grapherKeys2.length) valid = false;
  for (const grapherKey1 of grapherKeys1) {
    if (!grapherKeys2.includes(grapherKey1)) valid = false;
  }

  if (!valid) {
    throw Error("Faulty configuration of runs events config!");
  }
})();

export {
  runEventTypes,
  runEventConsoleDataTypes,
  runEventDataTypes,
  runEventStatuses,
  grapherEventTypes,
  getRunEvent,
};
