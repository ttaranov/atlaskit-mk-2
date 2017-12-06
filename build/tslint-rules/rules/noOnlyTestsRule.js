'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Lint = require('tslint');
const ts = require('typescript');
class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile) {
    return this.applyWithWalker(new NoOnlyTests(sourceFile, this.getOptions()));
  }
}
exports.Rule = Rule;
const objNames = ['describe', 'context', 'suite', 'it', 'specify', 'test'];
/**
 * Rule for preventing from committing .only test.
 */
class NoOnlyTests extends Lint.RuleWalker {
  visitCallExpression(node) {
    const expression =
      node.expression.kind === ts.SyntaxKind.PropertyAccessExpression
        ? node.expression
        : null;
    if (
      expression &&
      objNames.indexOf(expression.expression.getText()) !== -1 &&
      expression.name.text === 'only'
    ) {
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          `${node.expression.getText()} is not permitted!`,
        ),
      );
    }
    super.visitCallExpression(node);
  }
}
