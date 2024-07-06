import { EditorState } from "@codemirror/state";
import { cmSetup } from "./codeMirrorSetup";
import { cpp } from "@codemirror/lang-cpp";

const defaultContent = `#include <bits/stdc++.h>

using namespace std;

int main() {
	cout << "hello world\\n";
}`;

const getNewEditorState = (content) => {
  return EditorState.create({
    doc: content === undefined ? defaultContent : content,
    extensions: [cmSetup, cpp()],
  });
};

export { getNewEditorState };
