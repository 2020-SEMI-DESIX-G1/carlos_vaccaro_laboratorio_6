module.exports=function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=3)}([function(e,t){e.exports=require("vscode")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(2);function s(e,t){let i=e.getWordRangeAtPosition(t);return i||(i=e.getWordRangeAtPosition(t,/[^\s]+/)),i}function o(e,t,i=8,r=!0){let s=t.start.with({character:Math.max(0,t.start.character-i)}),o=e.getWordRangeAtPosition(s),a=e.getText(new n.Range(o?o.start:s,t.start)),c=e.getText(t),l=t.end.translate(0,331),d=e.getText(new n.Range(t.end,l));return r&&(a=a.replace(/^\s*/g,""),d=d.replace(/\s*$/g,"")),{before:a,inside:c,after:d}}t.getRequestRange=s,t.getPreviewChunks=o;class a{constructor(e){this.name=e}async set(e){n.commands.executeCommand("setContext",this.name,e)}}t.Context=a,a.IsActive=new a("reference-list.isActive"),a.Source=new a("reference-list.source"),a.HasResult=new a("reference-list.hasResult"),a.HasHistory=new a("reference-list.hasHistory"),a.CallHierarchyMode=new a("references-view.callHierarchyMode");class c{constructor(e,t,i){this.uri=e,this.results=t,this.parent=i}}t.FileItem=c;class l{constructor(e,t){this.location=e,this.parent=t}async getDocument(e){if(this._document||(this._document=n.workspace.openTextDocument(this.location.uri)),e){const e=await this.parent.parent.move(this,!0);e&&!e._document&&this._document.then(()=>e.getDocument(!1))}return this._document}}t.ReferenceItem=l;class d{constructor(e,t,i,r){this.source=e,this.uri=t,this.position=i,this._onDidChange=new n.EventEmitter,this.onDidChange=this._onDidChange.event,this.items=r.then(e=>{const t=[];let i;e.sort(d._compareLocations);for(const r of e){const e=r instanceof n.Location?r:new n.Location(r.targetUri,r.targetRange);i&&0===d._compareUriIgnoreFragment(i.uri,e.uri)||(i=new c(e.uri.with({fragment:""}),[],this),t.push(i)),i.results.push(new l(e,i))}return t})}static create(e,t,i){const r=Promise.resolve(n.commands.executeCommand(i,e,t)).then(e=>null!=e?e:[]);return new d(i,e,t,r)}async asHistoryItem(e){let t;try{t=await n.workspace.openTextDocument(this.uri)}catch(e){return}const i=s(t,this.position);if(!i)return;let{before:a,inside:c,after:l}=o(t,i);a=a.replace(/s$/g,String.fromCharCode(160)),l=l.replace(/^s/g,String.fromCharCode(160));let d=a+c+l,m="vscode.executeImplementationProvider"===this.source?"implementations":"references";return new r.HistoryItem(r.HistoryItem.makeId(this.source,this.uri,this.position),c,`${n.workspace.asRelativePath(this.uri)} • ${d} • ${m}`,"references-view.refindReference",e,this.uri,new r.WordAnchor(t,this.position))}async total(){let e=0;for(const t of await this.items)e+=t.results.length;return e}async get(e){for(const t of await this.items)if(t.uri.toString()===e.toString())return t}async first(){const e=await this.items;if(0===e.length)return;for(const t of e)if(t.uri.toString()===this.uri.toString()){for(const e of t.results)if(e.location.range.contains(this.position))return e;let e;for(const i of t.results){if(i.location.range.end.isAfter(this.position))return i;e=i}if(e)return e;break}let t=0,i=d._prefixLen(e[t].toString(),this.uri.toString());for(let n=1;n<e.length;n++){d._prefixLen(e[n].uri.toString(),this.uri.toString())>i&&(t=n)}return e[t].results[0]}async remove(e){e instanceof c?(d._del(await this.items,e),this._onDidChange.fire(this)):e instanceof l&&(d._del(e.parent.results,e),0===e.parent.results.length?(d._del(await this.items,e.parent),this._onDidChange.fire(this)):this._onDidChange.fire(e.parent))}async move(e,t){const i=await this.items,n=t?1:-1,r=e=>{const t=(i.indexOf(e)+n+i.length)%i.length;return i[t]};if(e instanceof c)return t?r(e).results[0]:d._tail(r(e).results);if(e instanceof l){const t=e.parent.results.indexOf(e)+n;return t<0?d._tail(r(e.parent).results):t>=e.parent.results.length?r(e.parent).results[0]:e.parent.results[t]}}static _compareUriIgnoreFragment(e,t){let i=e.with({fragment:""}).toString(),n=t.with({fragment:""}).toString();return i<n?-1:i>n?1:0}static _compareLocations(e,t){let i=e instanceof n.Location?e.uri:e.targetUri,r=t instanceof n.Location?t.uri:t.targetUri;if(i.toString()<r.toString())return-1;if(i.toString()>r.toString())return 1;let s=e instanceof n.Location?e.range:e.targetRange,o=t instanceof n.Location?t.range:t.targetRange;return s.start.isBefore(o.start)?-1:s.start.isAfter(o.start)?1:0}static _prefixLen(e,t){let i=0;for(;i<e.length&&i<t.length&&e.charCodeAt(i)===t.charCodeAt(i);)i+=1;return i}static _del(e,t){const i=e.indexOf(t);i>=0&&e.splice(i,1)}static _tail(e){return e[e.length-1]}}t.ReferencesModel=d;class m{constructor(e,t=1){this._mem=e,this._value=t;const i=e.get(m._key);this.value="number"==typeof i&&i>=0&&i<=1?i:t}get value(){return this._value}set value(e){this._value=e,a.CallHierarchyMode.set(0===this._value?"showIncoming":"showOutgoing"),this._mem.update(m._key,e)}}t.RichCallsDirection=m,m._key="references-view.callHierarchyMode";class h{constructor(e,t,i){this.item=e,this.parent=t,this.locations=i}}t.CallItem=h;class u{constructor(e,t,i){this.uri=e,this.position=t,this.direction=i,this.source="callHierarchy",this.roots=Promise.resolve(n.commands.executeCommand("vscode.prepareCallHierarchy",e,t)).then(e=>e?e.map(e=>new h(e,void 0,void 0)):[])}async resolveCalls(e){if(0===this.direction){const t=await n.commands.executeCommand("vscode.provideIncomingCalls",e.item);return t?t.map(t=>new h(t.from,e,t.fromRanges.map(e=>new n.Location(t.from.uri,e)))):[]}{const t=await n.commands.executeCommand("vscode.provideOutgoingCalls",e.item);return t?t.map(t=>new h(t.to,e,t.fromRanges.map(t=>new n.Location(e.item.uri,t)))):[]}}changeDirection(){return new u(this.uri,this.position,0===this.direction?1:0)}async isEmpty(){return 0===(await this.roots).length}async first(){const[e]=await this.roots;return e}async asHistoryItem(e){const[t]=await this.roots,i=0===this.direction?"calls from":"callers of";return new r.HistoryItem(r.HistoryItem.makeId(t.item.uri,t.item.selectionRange.start.line,t.item.selectionRange.start.character,this.direction),t.item.name,`${n.workspace.asRelativePath(this.uri)} • ${i}`,"references-view.showCallHierarchy",e,this.uri,new r.WordAnchor(await n.workspace.openTextDocument(this.uri),this.position))}}t.CallsModel=u},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(1);t.WordAnchor=class{constructor(e,t){this._doc=e,this._position=t,this._version=e.version,this._word=this._getAnchorWord(e,t)}_getAnchorWord(e,t){const i=e.getWordRangeAtPosition(t)||e.getWordRangeAtPosition(t,/[^\s]+/);return i&&e.getText(i)}getPosition(){if(!this._word)return this._position;if(this._version===this._doc.version)return this._position;const e=this._getAnchorWord(this._doc,this._position);if(this._word===e)return this._position;const t=this._position.line;let i,r,s=0;do{if(r=!1,i=t+s,i<this._doc.lineCount){r=!0;let e=this._doc.lineAt(i).text.indexOf(this._word);if(e>=0)return new n.Position(i,e)}if(s+=1,i=t-s,i>=0){r=!0;let e=this._doc.lineAt(i).text.indexOf(this._word);if(e>=0)return new n.Position(i,e)}}while(s<100&&r);return this._position}};t.HistoryItem=class{constructor(e,t,i,n,r,s,o){this.id=e,this.label=t,this.description=i,this.commandId=n,this.extraArgs=r,this.uri=s,this.anchor=o}static makeId(...e){let t="";for(const i of e)t+=JSON.stringify(i);return Buffer.from(t).toString("base64")}};class s{constructor(){this._items=new Map}get isEmpty(){return 0==this._items.size}*[Symbol.iterator](){let e=[...this._items.values()];for(let t=e.length-1;t>=0;t--)yield e[t]}add(e){e&&(this._items.delete(e.id),this._items.set(e.id,e),r.Context.HasHistory.set(!0))}get(e){return this._items.get(e)}clear(){this._items.clear(),r.Context.HasHistory.set(!1)}}t.History=s},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(4),s=i(2),o=i(1),a=i(5);t.activate=function(e){const t=new o.RichCallsDirection(e.globalState),i=new s.History,c=new a.TreeDataProviderWrapper,l="references-view.tree",d=n.window.createTreeView(l,{treeDataProvider:c,showCollapseAll:!0}),m=new r.EditorHighlights(d);let h;n.window.onDidChangeActiveTextEditor(()=>d.visible&&m.show(),void 0,e.subscriptions),d.onDidChangeVisibility(e=>e.visible?m.show():m.hide(),void 0,e.subscriptions);const u=async e=>{var t;h=e,d.message=void 0,m.setModel(h),o.Context.HasResult.set(Boolean(h)),o.Context.Source.set(null===(t=h)||void 0===t?void 0:t.source),(async()=>{await o.Context.IsActive.set(!0),await n.commands.executeCommand(l+".focus")})(),c.update(e||i),e?await g():f()},f=()=>{let e;e=i.isEmpty?"No results.":"No results. Try running a previous search again:",d.message=e,d.title="Results"},g=async()=>{if(h instanceof o.ReferencesModel){const e=await h.total(),t=(await h.items).length;d.message=1===e&&1===t?`${e} result in ${t} file`:1===e?`${e} result in ${t} files`:1===t?`${e} results in ${t} file`:`${e} results in ${t} files`,"vscode.executeReferenceProvider"===h.source?d.title=`Results (${e})`:"vscode.executeImplementationProvider"===h.source&&(d.title=`Implementations (${e})`)}else h instanceof o.CallsModel?(0===h.direction?d.title="Callers Of":d.title="Calls From",d.message=""):(d.message=void 0,d.title="Results")},v=async e=>{if(await u(e),e){if(0===(await e.items).length)return void await u(void 0);const t=await e.first();t&&d.visible&&d.reveal(t,{select:!0,focus:!0}),i.add(await e.asHistoryItem([e.source]))}},p=async(e,t,i)=>{let r;if(t instanceof n.Uri&&i instanceof n.Position)r=o.ReferencesModel.create(t,i,e);else if(n.window.activeTextEditor){let t=n.window.activeTextEditor;o.getRequestRange(t.document,t.selection.active)&&(r=o.ReferencesModel.create(t.document.uri,t.selection.active,e))}v(r)},w=e=>{e instanceof s.HistoryItem&&n.commands.executeCommand(e.commandId,...e.extraArgs,e.uri,e.anchor.getPosition())},_=async(e=t.value,r,s)=>{let a;if(r instanceof n.Uri&&s instanceof n.Position)a=new o.CallsModel(r,s,e);else if(n.window.activeTextEditor){let t=n.window.activeTextEditor;o.getRequestRange(t.document,t.selection.active)&&(a=new o.CallsModel(t.document.uri,t.selection.active,e))}if(await u(a),a instanceof o.CallsModel){if(await a.isEmpty())return void await u(void 0);const e=await a.first();e&&d.visible&&d.reveal(e,{select:!0,focus:!0,expand:!0}),i.add(await a.asHistoryItem([a.direction]))}},y=async(e,i)=>(t.value=e,i instanceof o.CallItem?_(e,i.item.uri,i.item.selectionRange.start):h instanceof o.CallsModel?_(e,h.uri,h.position):void 0),C=(e,t)=>{let i,r,a=!t;if(e instanceof o.ReferenceItem){const{location:t}=e;i=t.uri,r=t.range.start}else e instanceof o.CallItem?(i=e.item.uri,r=e.item.selectionRange.start):e instanceof s.HistoryItem&&(i=e.uri,r=e.anchor.getPosition(),a=!1);if(i&&r)return n.commands.executeCommand("vscode.open",i,{selection:new n.Range(r,r),preserveFocus:a})},b=async e=>{if(!(h instanceof o.ReferencesModel))return;const t=d.selection[0]||h.first();if(t instanceof s.HistoryItem||t instanceof o.CallItem)return;const i=await h.move(t,e);i&&(d.reveal(i,{select:!0}),C(i,!0))},I=async e=>{let t="",i=[e];for(;i.length>0;){let e=i.pop();if(e instanceof o.ReferencesModel)i.push(...(await e.items).slice(0,99));else if(e instanceof o.ReferenceItem){let i=await e.getDocument(),n=o.getPreviewChunks(i,e.location.range,21,!1);t+=`  ${e.location.range.start.line+1}, ${e.location.range.start.character+1}: ${n.before+n.inside+n.after} \n`}else e instanceof o.FileItem&&(t+=n.workspace.asRelativePath(e.uri)+" \n",i.push(...e.results))}t&&await n.env.clipboard.writeText(t)},x=async(e,t,i)=>{await v(new o.ReferencesModel("vscode.executeReferenceProvider",e,t,Promise.resolve(i)))};let R;const T="references.preferredLocation";function D(e){if(e&&!e.affectsConfiguration(T))return;const t=n.workspace.getConfiguration().get(T);R&&(R.dispose(),R=void 0),"view"===t&&(R=n.commands.registerCommand("editor.action.showReferences",x))}D(),e.subscriptions.push(d,n.workspace.onDidChangeConfiguration(D),n.commands.registerCommand("references-view.find",()=>p("vscode.executeReferenceProvider")),n.commands.registerCommand("references-view.findImplementations",()=>p("vscode.executeImplementationProvider")),n.commands.registerCommand("references-view.refindReference",p),n.commands.registerCommand("references-view.showCallHierarchy",()=>_()),n.commands.registerCommand("references-view.showOutgoingCalls",e=>y(1,e)),n.commands.registerCommand("references-view.showIncomingCalls",e=>y(0,e)),n.commands.registerCommand("references-view.refind",w),n.commands.registerCommand("references-view.refresh",async()=>{const[e]=i;e&&w(e)}),n.commands.registerCommand("references-view.clear",async()=>{await u(void 0)}),n.commands.registerCommand("references-view.clearHistory",async()=>{i.clear(),await u(void 0)}),n.commands.registerCommand("references-view.show",C),n.commands.registerCommand("references-view.remove",async e=>{var t;if(h instanceof o.ReferencesModel){let i;e instanceof o.ReferenceItem&&(i=await h.move(e,!0),(null===(t=i)||void 0===t?void 0:t.parent)!==e.parent&&(i=void 0)),await h.remove(e),m.refresh(),g(),i&&d.reveal(i,{select:!0})}}),n.commands.registerCommand("references-view.next",()=>b(!0)),n.commands.registerCommand("references-view.prev",()=>b(!1)),n.commands.registerCommand("references-view.copy",I),n.commands.registerCommand("references-view.copyAll",()=>I(h)),n.commands.registerCommand("references-view.copyPath",e=>{e instanceof o.FileItem&&("file"===e.uri.scheme?n.env.clipboard.writeText(e.uri.fsPath):n.env.clipboard.writeText(e.uri.toString(!0)))}),n.commands.registerCommand("references-view.pickFromHistory",async()=>{const e=[...i].map(e=>({label:e.label,description:e.description,item:e})),t=await n.window.showQuickPick(e,{placeHolder:"Select previous reference search"});t&&await w(t.item)}))}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(1);t.EditorHighlights=class{constructor(e){this._view=e,this._decorationType=n.window.createTextEditorDecorationType({backgroundColor:new n.ThemeColor("editor.findMatchHighlightBackground"),rangeBehavior:n.DecorationRangeBehavior.ClosedClosed,overviewRulerLane:n.OverviewRulerLane.Center,overviewRulerColor:new n.ThemeColor("editor.findMatchHighlightBackground")}),this._ignore=new Set}setModel(e){this._model=e,this._ignore.clear(),this._listener&&this._listener.dispose(),e instanceof r.ReferencesModel?this._listener=n.workspace.onDidChangeTextDocument(async t=>{this._ignore.add(await e.get(t.document.uri))}):e instanceof r.CallsModel&&(this._listener=this._view.onDidChangeSelection(()=>{this.show()})),this.show()}async show(){const{activeTextEditor:e}=n.window;if(e&&e.viewColumn){const t=[];if(this._model instanceof r.ReferencesModel){const i=await this._model.get(e.document.uri);i&&!this._ignore.has(i)&&t.push(...i.results.map(e=>e.location.range))}else if(this._model instanceof r.CallsModel){const[i]=this._view.selection;if(i instanceof r.CallItem){let r=i.locations;r||(r=[new n.Location(i.item.uri,i.item.selectionRange)]);for(const i of r)i.uri.toString()===e.document.uri.toString()&&t.push(i.range)}}e.setDecorations(this._decorationType,t)}}hide(){for(const e of n.window.visibleTextEditors)e.setDecorations(this._decorationType,[])}refresh(){this.hide(),this.show()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(1);class s{constructor(e){this._model=e,this._onDidChangeTreeData=new n.EventEmitter,this.onDidChangeTreeData=this._onDidChangeTreeData.event,this._modelListener=e.onDidChange(e=>this._onDidChangeTreeData.fire(e instanceof r.FileItem?e:void 0))}dispose(){this._onDidChangeTreeData.dispose(),this._modelListener.dispose()}async getTreeItem(e){if(e instanceof r.FileItem){const t=new n.TreeItem(e.uri);return t.contextValue="file-item",t.description=!0,t.iconPath=n.ThemeIcon.File,t.collapsibleState=n.TreeItemCollapsibleState.Collapsed,t}{const{range:t}=e.location,i=await e.getDocument(!0),{before:s,inside:o,after:a}=r.getPreviewChunks(i,t),c={label:s+o+a,highlights:[[s.length,s.length+o.length]]},l=new n.TreeItem2(c);return l.collapsibleState=n.TreeItemCollapsibleState.None,l.contextValue="reference-item",l.command={command:"references-view.show",title:"Open Reference",arguments:[e]},l}}async getChildren(e){return e?e instanceof r.FileItem?e.results:void 0:this._model.items}getParent(e){return e instanceof r.ReferenceItem?e.parent:void 0}}t.ReferencesProvider=s;class o{constructor(e){this._model=e,this._emitter=new n.EventEmitter,this.onDidChangeTreeData=this._emitter.event}getTreeItem(e){const t=new n.TreeItem(e.item.name);return t.description=e.item.detail,t.contextValue="call-item",t.iconPath=o._getThemeIcon(e.item.kind),t.command={command:"references-view.show",title:"Open Call",arguments:[e]},t.collapsibleState=n.TreeItemCollapsibleState.Collapsed,t}getChildren(e){return e?this._model.resolveCalls(e):this._model.roots}getParent(e){return e.parent}static _getThemeIcon(e){let t=o._themeIconIds[e];return t&&new n.ThemeIcon(t)}}t.CallItemDataProvider=o,o._themeIconIds=["symbol-file","symbol-module","symbol-namespace","symbol-package","symbol-class","symbol-method","symbol-property","symbol-field","symbol-constructor","symbol-enum","symbol-interface","symbol-function","symbol-variable","symbol-constant","symbol-string","symbol-number","symbol-boolean","symbol-array","symbol-object","symbol-key","symbol-null","symbol-enum-member","symbol-struct","symbol-event","symbol-operator","symbol-type-parameter"];class a{constructor(e){this._history=e,this._emitter=new n.EventEmitter,this.onDidChangeTreeData=this._emitter.event}getTreeItem(e){const t=new n.TreeItem(e.label);return t.description=e.description,t.command={command:"references-view.show",arguments:[e],title:"Show"},t.collapsibleState=n.TreeItemCollapsibleState.None,t.contextValue="history-item",t}getChildren(){return[...this._history]}getParent(){}}t.HistoryDataProvider=a;t.TreeDataProviderWrapper=class{constructor(){this._onDidChange=new n.EventEmitter,this.onDidChangeTreeData=this._onDidChange.event}update(e){this._providerListener&&(this._providerListener.dispose(),this._providerListener=void 0),this._provider&&"function"==typeof this._provider.dispose&&(this._provider.dispose(),this._provider=void 0),e instanceof r.ReferencesModel?this._provider=new s(e):e instanceof r.CallsModel?this._provider=new o(e):this._provider=new a(e),this._onDidChange.fire(),this._providerListener=this._provider.onDidChangeTreeData(e=>this._onDidChange.fire(e))}getTreeItem(e){return this._provider.getTreeItem(e)}getChildren(e){var t;return null===(t=this._provider)||void 0===t?void 0:t.getChildren(e)}getParent(e){var t;return null===(t=this._provider)||void 0===t?void 0:t.getParent(e)}}}]);
//# sourceMappingURL=extension.js.map