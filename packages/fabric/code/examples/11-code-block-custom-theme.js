"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var src_1 = require("../src");
var util_shared_styles_1 = require("@atlaskit/util-shared-styles");
var exampleCodeBlock = "// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);\n\nint count = map.forEach(new IntIntProcedure()\n{\n   int count;\n   public void apply(int key, int value)\n   {\n       if (value >= 5) count++;\n   }\n}).count;\nSystem.out.println(\"There are \" + count + \" values >= 5\");";
var theme = {
    lineNumberColor: util_shared_styles_1.akColorN90,
    lineNumberBgColor: util_shared_styles_1.akColorN600,
    backgroundColor: util_shared_styles_1.akColorN400,
    textColor: util_shared_styles_1.akColorN50,
    substringColor: util_shared_styles_1.akColorN400,
    keywordColor: util_shared_styles_1.akColorP75,
    attributeColor: util_shared_styles_1.akColorT500,
    selectorTagColor: util_shared_styles_1.akColorP75,
    nameColor: util_shared_styles_1.akColorP75,
    builtInColor: util_shared_styles_1.akColorP75,
    literalColor: util_shared_styles_1.akColorP75,
    bulletColor: util_shared_styles_1.akColorP75,
    codeColor: util_shared_styles_1.akColorP75,
    additionColor: util_shared_styles_1.akColorP75,
    regexpColor: util_shared_styles_1.akColorT300,
    symbolColor: util_shared_styles_1.akColorT300,
    variableColor: util_shared_styles_1.akColorT300,
    templateVariableColor: util_shared_styles_1.akColorT300,
    linkColor: util_shared_styles_1.akColorB100,
    selectorAttributeColor: util_shared_styles_1.akColorT300,
    selectorPseudoColor: util_shared_styles_1.akColorT300,
    typeColor: util_shared_styles_1.akColorT500,
    stringColor: util_shared_styles_1.akColorG200,
    selectorIdColor: util_shared_styles_1.akColorT500,
    selectorClassColor: util_shared_styles_1.akColorT500,
    quoteColor: util_shared_styles_1.akColorT500,
    templateTagColor: util_shared_styles_1.akColorT500,
    deletionColor: util_shared_styles_1.akColorT500,
    titleColor: util_shared_styles_1.akColorR100,
    sectionColor: util_shared_styles_1.akColorR100,
    commentColor: util_shared_styles_1.akColorN90,
    metaKeywordColor: util_shared_styles_1.akColorG200,
    metaColor: util_shared_styles_1.akColorN400,
    functionColor: util_shared_styles_1.akColorG200,
    numberColor: util_shared_styles_1.akColorB100
};
function Component() {
    return React.createElement(src_1.AkCodeBlock, { language: "java", text: exampleCodeBlock, theme: theme });
}
exports.default = Component;
//# sourceMappingURL=11-code-block-custom-theme.js.map