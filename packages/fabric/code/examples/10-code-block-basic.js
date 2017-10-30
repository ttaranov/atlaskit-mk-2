"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var src_1 = require("../src");
var exampleCodeBlock = "// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);\n\nint count = map.forEach(new IntIntProcedure()\n{\n   int count;\n   public void apply(int key, int value)\n   {\n       if (value >= 5) count++;\n   }\n}).count;\nSystem.out.println(\"There are \" + count + \" values >= 5\");";
function Component() {
    return React.createElement(src_1.AkCodeBlock, { language: "java", text: exampleCodeBlock });
}
exports.default = Component;
//# sourceMappingURL=10-code-block-basic.js.map