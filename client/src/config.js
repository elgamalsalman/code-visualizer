const config = {
  home: {
    dataStructuresPresented: [
      { name: "Linked-lists", isAvailable: true },
      { name: "Trees", isAvailable: true },
      { name: "Vectors", isAvailable: false },
      { name: "Graphs", isAvailable: false },
    ],
  },
  api: {
    url: "http://localhost:3001/api/v1",
  },
  http_codes: {
    success: 200,
    failed: 500,
    unauthorized: 401,
    forbidden: 403,
  },
  storage: {
    fileKeysPrefix: "file:",
  },
  alerter: {
    alertsLifeTime: 5000,
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
  console: {},
  autoSavingDelay: 5000,
};

export default config;
