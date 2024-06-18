import React, { useRef } from "react";

import config from "src/config";
import "./MonacoEditorFix.js";

import MonacoEditor from "@monaco-editor/react";

function Editor({ model: modelRef, onChange }) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("dark", config.editor.themes["dark"]);
    monaco.editor.setTheme("dark");
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    if (modelRef.current) editor.setModel(modelRef.current);
    editor.getModel().onDidChangeContent((event) => {
      onChange();
    });
    if (!modelRef.current) modelRef.current = editor.getModel();
  };

  return (
    <div>
      <MonacoEditor
        height="80vh"
        defaultLanguage="cpp"
        defaultValue={config.editor.defaultValue}
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
