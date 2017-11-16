import { name } from '../../../package.json';
import { createSchema } from '../../../src';
import { toHTML } from '../../../test-helpers';

describe(`${name}/schema action mark`, () => {

  it('serializes to <span data-mark-type="action">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.action.create({
      title: 'some-title',
      target: {
        receiver: 'some-receiver',
        key: 'test'
      }
    })]);
    expect(toHTML(node, schema)).toEqual('<span data-mark-type="action" data-action-mark-title="some-title" data-action-mark-target-receiver="some-receiver" data-action-mark-target-key="test">foo</span>');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['action']
  });
}
