"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
exports.default = (options) => __awaiter(void 0, void 0, void 0, function* () {
    let isShowDialog = options && options.showDialog ? true : false;
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('activeTextEditorが不明です。');
    }
    // 選択範囲テキスト取得
    let text = editor.document.getText(editor.selection);
    if (!text) {
        throw new Error('コミットテキストを選択してください。');
    }
    let input = text;
    if (isShowDialog) {
        input = yield vscode.window.showInputBox({
            prompt: 'コミットメッセージを入力してください＊＊',
            value: text
        });
        if (!input) {
            return Promise.resolve(''); // cancel
        }
    }
    vscode.workspace.saveAll();
    if (!vscode.workspace.rootPath) {
        throw new Error('ワークスペースルートパスが不明です。');
    }
    let cmd = `git add . && git commit -m"${input}"`;
    return exec(cmd, { cwd: vscode.workspace.rootPath }).then(() => cmd);
});
//# sourceMappingURL=selectionCommentGitCommit.js.map