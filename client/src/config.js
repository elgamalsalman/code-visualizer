const config = {
  appRunningStatuses: {
    connecting: "connecting",
    running: "running",
    idle: "idle",
  },
  server: {
    url: "http://localhost:3001",
    api: {
      url: "http://localhost:3001/api/v1",
      ws: {
        url: "http://localhost:3001/api/v1/ws",
      },
    },
  },
  editor: {
    themes: {
      dark: {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1e293b",
          "editor.lineHighlightBackground": "#334155",
        },
      },
    },
    defaultValue: "// your code here",
  },
  console: {
    defaultRowCount: 3,
    runStatuses: {
      running: "running",
      success: "success",
      failed: "failed",
    },
    runTemplate: {
      id: 0,
      data: [],
      status: "running",
    },
    runDataTemplate: {
      id: 0,
      type: "input",
      content: "34",
    },
    runDataTypes: {
      input: "input",
      output: "output",
      error: "error",
    },
  },
  autoSavingDelay: 5000,

  testing: {
    pastRuns: [
      {
        id: 0,
        data: [
          { type: "output", content: "enter x:" },
          { type: "input", content: "34\n" },
          { type: "output", content: "enter y:" },
          { type: "input", content: "-12\n" },
          { type: "error", content: "Can't process -ves!" },
        ],
        status: "failed",
      },
      {
        id: 1,
        data: [
          { type: "output", content: "enter x:" },
          { type: "input", content: "3\n" },
          { type: "output", content: "enter y:" },
          { type: "input", content: "2\n" },
          { type: "output", content: "Result is 5!" },
        ],
        status: "success",
      },
    ],

    currRun: null,
    // currRun: {
    //   id: 2,
    //   data: [{ type: "output", content: "enter x:" }],
    //   status: "running",
    // },
    idCounter: 2,
    user_id: "test_user",
  },
};

export default config;
