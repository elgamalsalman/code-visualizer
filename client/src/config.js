const config = {
  userId: "test_user",
  server: {
    url: "http://localhost:3001",
    api: {
      url: "http://localhost:3001/api/v1",
      ws: {
        url: "http://localhost:3001/api/v1/ws",
      },
    },
    http_codes: {
      success: 200,
      failed: 500,
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
  },
  autoSavingDelay: 5000,
};

export default config;
