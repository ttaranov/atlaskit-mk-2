"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var src_1 = require("../src");
var exampleInlineCode = "const map = new Map({ key: 'value' })";
function Component() {
    return (React.createElement("span", null,
        "This is inline code:",
        " ",
        React.createElement(src_1.AkCode, { language: "javascript", text: exampleInlineCode }),
        ", check it out."));
}
exports.default = Component;
//# sourceMappingURL=00-inline-code-basic.js.map