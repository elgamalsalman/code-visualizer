const runEventTypes = {
  compilation: "compilation",
  stdin: "stdin",
  stdout: "stdout",
  stderr: "stderr",
  grapher: "grapher",
  error: "error",
  terminate: "terminate",
};

const getRunEventTemplate = {
  compilation: (status) => {
    return {
      type: runEventTypes.compilation,
      status: status,
    };
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
  grapher: (event) => {
    return {
      type: runEventTypes.grapher,
      event: event,
    };
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
  const keys1 = runEventTypes.keys();
  const keys2 = getRunEventTypes.keys();
  const valid = true;
  if (keys1.length !== keys2.length) valid = false;
  for (const key1 of keys1) {
    if (!(key1 in keys2)) valid = false;
  }

  if (!valid) {
    throw Error("Faulty configuration of runs events config!");
  }
})();

export { runEventTypes, getRunEventTemplate };
