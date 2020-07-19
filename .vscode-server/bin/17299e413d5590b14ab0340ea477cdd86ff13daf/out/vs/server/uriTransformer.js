/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
module.exports=function(e){return{transformIncoming:e=>"vscode-remote"===e.scheme?{scheme:"file",path:e.path}:"file"===e.scheme?{scheme:"vscode-local",path:e.path}:e,transformOutgoing:o=>"file"===o.scheme?{scheme:"vscode-remote",authority:e,path:o.path}:"vscode-local"===o.scheme?{scheme:"file",path:o.path}:o,transformOutgoingScheme:e=>"file"===e?"vscode-remote":"vscode-local"===e?"file":e}};
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/17299e413d5590b14ab0340ea477cdd86ff13daf/core/vs/server/uriTransformer.js.map
