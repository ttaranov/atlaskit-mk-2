import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema taskList node`, () => {
  it('serializes to <ol> with proper data-attributes', () => {
    const html = toHTML(
      schema.nodes.taskList.create({ localId: 'cheese' }),
      schema,
    );
    expect(html).toContain('<ol');
    expect(html).toContain('data-task-list-local-id="cheese"');
  });

  it('matches <ol data-task-list-local-id>', () => {
    const doc = fromHTML('<ol data-task-list-local-id>', schema);
    const taskList = doc.firstChild!;
    expect(taskList.type.name).toEqual('taskList');
    expect(taskList.attrs.localId).not.toEqual(undefined);
  });

  it('does not match <ol>', () => {
    const doc = fromHTML('<ol>', schema);
    const orderedList = doc.firstChild!;
    expect(orderedList.type.name).toEqual('orderedList');
  });

  it('taskList requires defining to be true', () => {
    expect(schema.nodes.taskList.spec.defining).toBe(true);
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'text',
      'taskList',
      'taskItem',
      'orderedList',
      'bulletList',
      'listItem',
    ],
  });
}
