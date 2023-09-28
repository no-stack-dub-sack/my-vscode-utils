import path = require("path");

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const commands = {
    toggleMetaFiles: vscode.commands.registerCommand(
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
    ),

    autoComment: vscode.commands.registerTextEditorCommand(
      "my-vscode-utils.autoComment",
      () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const document = editor.document;

          if (isConfiguredExtension(document)) {
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
    ),

    surroundWithMultiLineComment: vscode.commands.registerCommand(
      "my-vscode-utils.surroundWithMultiLineComment",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const document = editor.document;

          if (isConfiguredExtension(document)) {
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
    ),
  };

  /**
   * Checks is the current document's extension is included in the user's
   * configuration of file types to apply comment-type commands to.
   */
  function isConfiguredExtension(document: vscode.TextDocument) {
    const fileExt = path.extname(document.fileName);
    const config = vscode.workspace.getConfiguration("my-vscode-utils");
    const fileTypes: string[] = config.get("comment.extensions") || [];

    if (fileTypes.length > 0 && fileTypes.includes(fileExt)) {
      return true;
    } else {
      return false;
    }
  }

  context.subscriptions.push(...Object.values(commands));
}

export function deactivate() {}
