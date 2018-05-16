const pmModel = require('../node_modules/prosemirror-model');
const diff = require('../node_modules/jest-diff');

expect.extend({
  toEqualDocument(actual, expected) {
    // Because schema is created dynamically, expected value is a function (schema) => PMNode;
    // That's why this magic is necessary. It simplifies writing assertions, so
    // instead of expect(doc).toEqualDocument(doc(p())(schema)) we can just do:
    // expect(doc).toEqualDocument(doc(p())).
    //
    // Also it fixes issues that happens sometimes when actual schema and expected schema
    // are different objects, making this case impossible by always using actual schema to create expected node.
    expected =
      typeof expected === 'function' && actual.type && actual.type.schema
        ? expected(actual.type.schema)
        : expected;

    if (
      !(expected instanceof pmModel.Node) ||
      !(actual instanceof pmModel.Node)
    ) {
      return {
        pass: false,
        actual,
        expected,
        name: 'toEqualDocument',
        message:
          'Expected both values to be instance of prosemirror-model Node.',
      };
    }

    if (expected.type.schema !== actual.type.schema) {
      return {
        pass: false,
        actual,
        expected,
        name: 'toEqualDocument',
        message: 'Expected both values to be using the same schema.',
      };
    }

    const pass = this.equals(actual.toJSON(), expected.toJSON());
    const message = pass
      ? () =>
          `${this.utils.matcherHint('.not.toEqualDocument')}\n\n` +
          `Expected JSON value of document to not equal:\n  ${this.utils.printExpected(
            expected,
          )}\n` +
          `Actual JSON:\n  ${this.utils.printReceived(actual)}`
      : () => {
          const diffString = diff(expected, actual, {
            expand: this.expand,
          });
          return (
            `${this.utils.matcherHint('.toEqualDocument')}\n\n` +
            `Expected JSON value of document to equal:\n${this.utils.printExpected(
              expected,
            )}\n` +
            `Actual JSON:\n  ${this.utils.printReceived(actual)}` +
            `${diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
          );
        };

    return {
      pass,
      actual,
      expected,
      message,
      name: 'toEqualDocument',
    };
  },
});
