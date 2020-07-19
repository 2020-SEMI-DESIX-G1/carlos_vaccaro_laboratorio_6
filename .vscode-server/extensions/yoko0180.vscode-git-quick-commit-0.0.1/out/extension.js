"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const selectionCommentGitCommit_1 = require("./command/selectionCommentGitCommit");
function handleSuccess(result) {
    if (result) {
        vscode.window.showInformationMessage(result);
    }
}
function handleError(err) {
    if (err && err.message) {
        vscode.window.showErrorMessage(err.message);
    }
    return err;
}
function register(context, command, commandName) {
    const proxy = (...args) => command().then(handleSuccess).catch(handleError);
    const disposable = vscode.commands.registerCommand(`vscode-git-quick-commit.${commandName}`, proxy);
    context.subscriptions.push(disposable);
}
function activate(context) {
    console.log('Congratulations, your extension "vscode-git-quick-commit" is now active!');
    register(context, selectionCommentGitCommit_1.default, 'selectionCommentGitCommit');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map