<br/>
<div align="center">
  <img width="380px" src="./assets/logo-large.png">
</div>
<br/>

# My VS Code Utils

A collection of very simple utilities that fix things that annoy me or accomplish simple tasks that help with productivity. I have no intention of ever publishing this.

## Features

### Hide/Show Salesforce Meta Files

I find it annoying to see all the meta files in my Salesforce projects. This extension allows you to hide/show them. For example, if you see the following files in your project:

```
- Foo.cls
- Foo.cls-meta.xml
```

You can hide the meta file by invoking the `Hide/Show Salesforce Meta Files` command from the Command Palette or by pressing <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>M</kbd> when the explorer is visible.

### Continue Single-Line Comments Automatically

I also find it annoying to have to type `//` on every line when writing a multi-line double-slash comment. I've tried a few extensions that claim to accomplish this, but none seem to work. This extension will automatically start the next line with `//` when you press <kbd>Enter</kbd> on a line that starts with `//`. To break out of a comment, press <kbd>Shift</kbd> + <kbd>Enter</kbd>.

The file types the this applies to can be configured in the `my-vscode-utils.comment.extensions` configurations setting. By default it will apply to Apex, C#, JavaScript, TypeScript, JSONC, and SASS files.

### Surround Selection with Multi-Line Comment

This feature is available in VS Code out-of-the-box, however it doesn't work with all file-types - specifically Apex. This command just overwrites the default keybinding (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>/</kbd>) with the same behavior, but applies it to the file-types specified in the `my-vscode-utils.comment.extensions` configurations setting.The command can also be invoked from the Command Palette with the `Surround Selection with Multi-Line Comment` command.

### Snippets

See the Snippets [docs](./snippets/docs) for a list of snippets that this extension contributes. You can also use the `List Available Snippets` command to see a list of available snippets for each file type.
