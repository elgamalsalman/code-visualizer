const config = {
  userId: "test_user",
  home: {
    dataStructuresPresented: [
      { name: "Linked-lists", isAvailable: true },
      { name: "Trees", isAvailable: true },
      { name: "Vectors", isAvailable: false },
      { name: "Graphs", isAvailable: false },
    ],
  },
  server: {
    url: "http://localhost:3001",
    api: {
      url: "http://localhost:3001/api/v1",
      ws: {
        url: "http://localhost:3001/api/v1/ws",
      },
      auth: {
        url: "http://localhost:3001/api/v1/auth",
        register: {
          url: "http://localhost:3001/api/v1/auth/register",
          password: {
            url: "http://localhost:3001/api/v1/auth/register/password",
          },
        },
        login: {
          url: "http://localhost:3001/api/v1/auth/login",
          password: {
            url: "http://localhost:3001/api/v1/auth/login/password",
          },
        },
        email_verification: {
          url: "http://localhost:3001/api/v1/auth/email-verification",
          send: {
            url: "http://localhost:3001/api/v1/auth/email-verification/send",
          },
          verify: {
            url: "http://localhost:3001/api/v1/auth/email-verification/verify",
          },
        },
      },
    },
    http_codes: {
      success: 200,
      failed: 500,
    },
  },
  storage: {
    fileKeysPrefix: "file:",
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
