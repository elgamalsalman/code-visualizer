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
};

export default config;
