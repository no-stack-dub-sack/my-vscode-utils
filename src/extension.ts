import path = require("path");

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let toggleMetaFiles = vscode.commands.registerCommand(
    "my-vscode-utils.toggleMetaFiles",
    async () => {
      const config = vscode.workspace.getConfiguration("files");
      const excludes = config.get("exclude") as any;

      if (excludes) {
        const isMetaExcluded = excludes["**/*-meta.xml"];

        if (isMetaExcluded) {
          excludes["**/*-meta.xml"] = false;
        } else {
          excludes["**/*-meta.xml"] = true;
        }

        await config.update(
          "exclude",
          excludes,
          vscode.ConfigurationTarget.Global
        );
      }
    }
  );

  let autoComment = vscode.commands.registerTextEditorCommand(
    "my-vscode-utils.autoComment",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        // get the file ext and the file types where the extension should work
        const fileExt = path.extname(document.fileName);
        const config = vscode.workspace.getConfiguration("my-vscode-utils");
        const fileTypes: string[] = config.get("comment.extensions") || [];

        if (fileTypes.length > 0 && fileTypes.includes(fileExt)) {
          const selection = editor.selection;
          const line = document.lineAt(selection.start.line);

          // check if current line starts with "//"
          const match = line.text.match(/^(\s*)\/\/.*/);

          if (match) {
            const indent = match[1]; // get the leading spaces

            // automatically continue the comment
            editor.edit((editBuilder) => {
              editBuilder.insert(selection.start, "\n" + indent + "// ");
            });
          } else {
            // start a new line respecting the user-defined Enter key action.
            vscode.commands.executeCommand("type", {
              source: "keyboard",
              text: "\n",
            });
          }
        }

        // if the file type is not included in the configuration0, or the
        // config array is empty, just execute the normal enter action
        else {
          vscode.commands.executeCommand("type", {
            source: "keyboard",
            text: "\n",
          });
        }
      }
    }
  );

  let surroundWithMultiLineComment = vscode.commands.registerCommand(
    "my-vscode-utils.surroundWithMultiLineComment",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;

        // get the file ext and the file types where the extension should work
        const fileExt = path.extname(document.fileName);
        const config = vscode.workspace.getConfiguration("my-vscode-utils");
        const fileTypes: string[] = config.get("comment.extensions") || [];

        if (fileTypes.length > 0 && fileTypes.includes(fileExt)) {
          const selection = editor.selection;

          // Get the selected text
          const text = document.getText(selection);

          // Surround the selected text with multi-line comment
          editor.edit((editBuilder) => {
            editBuilder.replace(selection, `/* ${text} */`);
          });
        }
      }
    }
  );

  const disposables = [
    toggleMetaFiles,
    autoComment,
    surroundWithMultiLineComment,
  ];

  context.subscriptions.push(...disposables);
}

export function deactivate() {}
