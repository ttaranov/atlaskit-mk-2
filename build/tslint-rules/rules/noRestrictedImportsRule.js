const Lint = require('tslint');
const ts = require('typescript');

class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile) {
    const options = this.getOptions();
    const restrictedPatterns = (options.ruleArguments[0] || []).map(
      pattern => new RegExp(pattern),
    );
    const ignorePattern = options.ruleArguments[1]
      ? new RegExp(options.ruleArguments[1])
      : null;
    options.ruleArguments = [restrictedPatterns, ignorePattern];
    return this.applyWithWalker(new NoRestrictedImports(sourceFile, options));
  }
}

exports.Rule = Rule;

class NoRestrictedImports extends Lint.RuleWalker {
  matchRestriction(text) {
    return this.options[0].some(pattern => pattern.test(text));
  }

  ignoreFile(filename) {
    return this.options[1] ? this.options[1].test(filename) : false;
  }

  visitImportDeclaration(node) {
    const text = node.moduleSpecifier.text;
    if (
      !this.ignoreFile(this.getSourceFile().fileName) &&
      this.matchRestriction(text)
    ) {
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          `Importing "${text}" is not allowed! As it has significant bundle size implications. Try using "${text}/..." and import only what's needed.`,
        ),
      );
    }
    super.visitImportDeclaration(node);
  }
}
