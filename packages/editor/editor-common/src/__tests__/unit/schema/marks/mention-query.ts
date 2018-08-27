import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML } from '../../../../../test-helpers';

describe(`${name}/schema mention-query mark`, () => {
  it('serializes to <span data-mention-query="true">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.mentionQuery.create()]);
    expect(toHTML(node, schema)).toContain('data-mention-query="true"');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['mentionQuery'],
  });
}
