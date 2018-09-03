import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML } from '../../../../../test-helpers';

describe(`${name}/schema emoji-query mark`, () => {
  it('serializes to <span data-emoji-query="true">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.emojiQuery.create()]);
    expect(toHTML(node, schema)).toContain('data-emoji-query="true"');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['emojiQuery'],
  });
}
