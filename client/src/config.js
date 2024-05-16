export default {
  server: {
    baseURL: "http://localhost:3001/api/",
  },
  editors: {
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
  // FIXME: change auto-saving delay in production
  autoSavingDelay: 3000,
};
