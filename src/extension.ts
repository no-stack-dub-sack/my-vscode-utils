import path = require("path");

import * as vscode from "vscode";

const EXTENSION_ID = "my-vscode-utils";

export function activate(context: vscode.ExtensionContext) {
  const commands = {
    toggleMetaFiles: vscode.commands.registerCommand(
      `${EXTENSION_ID}.toggleMetaFiles`,
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
      `${EXTENSION_ID}.autoComment`,
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
      `${EXTENSION_ID}.surroundWithMultiLineComment`,
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

    surroundWithTryCatch: vscode.commands.registerCommand(
      `${EXTENSION_ID}.surroundWithTryCatch`,
      async () => {
        const editor = vscode.window.activeTextEditor;
        const config = vscode.workspace.getConfiguration(EXTENSION_ID);

        const catchArgs = config.get("surroundWithTryCatch.catchArgs") as {
          [key: string]: string;
        };

        if (editor) {
          const document = editor.document;
          const selection = editor.selection;

          const linePadding = document.lineAt(
            selection.start.line
          ).firstNonWhitespaceCharacterIndex;

          const selectedTextLines = document.getText(selection).split("\n");
          const originalIndentation = " ".repeat(linePadding);

          const { insertSpaces, tabSize } = editor.options as {
            insertSpaces: boolean;
            tabSize: number;
          };

          const additionalIndentation = insertSpaces
            ? " ".repeat(tabSize as number)
            : "\t";

          const formattedLines = selectedTextLines
            .map((line, idx) =>
              idx === 0
                ? `${originalIndentation + additionalIndentation}${line.trim()}`
                : `${additionalIndentation}${line}`
            )
            .join("\n");

          const tryIndent = originalIndentation.slice(
            selection.start.character
          );

          let wrappedCode = `${tryIndent}try {\n${formattedLines}\n${originalIndentation}}`;

          let catchCursorPos: vscode.Position | undefined = undefined;

          const nextLine = document.lineAt(selection.end.line + 1);
          const nextLineText = nextLine.text.trim();
          const nextLineStartsWithClosingCurly = nextLineText.startsWith("}");
          const nextLineIsEmpty = nextLineText === "";
          const handleExceptionComment = "// handle the exception";

          const end =
            nextLineStartsWithClosingCurly || nextLineIsEmpty ? "" : "\n";

          for (const key in catchArgs) {
            const extensions = key.split(",");

            if (extensions.includes(path.extname(document.fileName))) {
              wrappedCode += ` catch (${catchArgs[key]}) {\n${originalIndentation}${additionalIndentation}${handleExceptionComment}\n${originalIndentation}}${end}`;

              const line = document.lineAt(editor.selection.end).lineNumber + 3;

              const character =
                originalIndentation.length +
                additionalIndentation.length +
                handleExceptionComment.length +
                1;

              catchCursorPos = new vscode.Position(line, character);

              break;
            }
          }

          await editor.edit((editBuilder) => {
            editBuilder.replace(selection, wrappedCode);
          });

          if (catchCursorPos) {
            editor.selection = new vscode.Selection(
              catchCursorPos,
              catchCursorPos
            );
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
    const config = vscode.workspace.getConfiguration(EXTENSION_ID);
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
