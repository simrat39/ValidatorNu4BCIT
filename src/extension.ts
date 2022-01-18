// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "validatornu4bcit" is now active!'
  );

  var diagCollec = vscode.languages.createDiagnosticCollection("nuValidator");

  var disposable = vscode.workspace.onDidSaveTextDocument((doc) => {
    if (doc.languageId !== "html") {
      return;
    }

    axios
      .post("https://html5.validator.nu/?out=json", doc.getText(), {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Content-Type": "text/html; charset=utf-8",
        },
      })
      .then((value) => {
        diagCollec.clear();

        var errs: Array<any> = value.data.messages;
        console.log(errs);

        if (errs.length > 0) {
          diagCollec.set(
            doc.uri,
            errs.map(
              (v) =>
                new vscode.Diagnostic(
                  new vscode.Range(
                    v.lastLine - 1,
                    v.firstColumn - 1,
                    v.lastLine - 1,
                    v.lastColumn - 1
                  ),
                  v.message
                )
            )
          );
        } else {
          vscode.window.showInformationMessage("No problems found!");
        }
      });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
