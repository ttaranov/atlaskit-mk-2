import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML } from '../../../../../test-helpers';

describe(`${name}/schema confluence-inline-comment mark`, () => {
  it('serializes to <span data-reference="hash-ref-goes-here">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.confluenceInlineComment.create({
        reference: 'hash-ref-goes-here',
      }),
    ]);
    expect(toHTML(node, schema)).toContain(
      'data-reference="hash-ref-goes-here"',
    );
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['confluenceInlineComment'],
  });
}
