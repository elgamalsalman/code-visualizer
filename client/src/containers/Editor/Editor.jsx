import React, { useRef } from "react";

import config from "src/config";

import MonacoEditor from "@monaco-editor/react";

function Editor({ editorRef, onChange }) {
  const monacoRef = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("dark", config.editor.themes["dark"]);
    monaco.editor.setTheme("dark");
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.getModel().onDidChangeContent((event) => {
      onChange();
    });
  };

  return (
    <div>
      <MonacoEditor
        height="80vh"
        defaultLanguage="cpp"
        defaultValue={config.editor.defaultValue}
        // line="2"
        // theme="dark"
        loading={null}
        theme="dark"
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          // cursorStyle: "block",
          wordWrap: "on",
        }}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default Editor;
