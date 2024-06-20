import React, { useId, useRef, useEffect } from "react";
import styles from "./Editor.module.css";

import config from "src/config";

import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

function Editor({ model: modelRef, onChange }) {
  // const monacoRef = useRef(null);
  // const editorRef = useRef(null);

  // const handleEditorWillMount = (monaco) => {
  //   monaco.editor.defineTheme("dark", config.editor.themes["dark"]);
  //   monaco.editor.setTheme("dark");
  // };

  // const handleEditorDidMount = (editor, monaco) => {
  //   editorRef.current = editor;
  //   monacoRef.current = monaco;

  //   // editor.setModel(modelRef.current);
  //   editor.setModel(monaco.editor.createModel("yesss", "cpp"));
  //   editor.getModel().onDidChangeContent((event) => {
  //     onChange();
  //   });
  // };
  const hasMountedRef = useRef(false);
  const editorDivId = useId();

  const editorDivHTMLId = `monaco-editor-${editorDivId}`;
  useEffect(() => {
    let startState = EditorState.create({
      doc: "Hello World",
      extensions: [keymap.of(defaultKeymap)],
    });

    let view = new EditorView({
      state: startState,
      parent: document.getElementById(editorDivHTMLId),
    });
  }, []);

  return <div id={editorDivHTMLId} className={styles["monaco-editor"]}></div>;
}

export default Editor;
