import * as vscode from "vscode";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "gist-to-code.opengist",
    async () => {
      const url = await vscode.window.showInputBox({
        placeHolder: "Enter the Gist URL or the ID",
        title: "Gist URL or ID",
      });

      if (url) {
        try {
          const gistId = url.match(/\b\w{32}\b/)?.[0];
          const gist = await axios.get(
            `https://api.github.com/gists/${gistId}`
          );
          for (let _file in gist.data.files) {
            const file = gist.data.files[_file];

            // TODO: Open Document that is already saved. Example: Link opening new Untitled File does.
            const doc = await vscode.workspace.openTextDocument({
              content: file.content,
              language: file.language, // TODO: detect language
            });

            await vscode.window.showTextDocument(doc);
          }
        } catch (error) {
          console.error(error);
          vscode.window.showErrorMessage(
            "Something went wrong.Gist ID might not be right."
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
