import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema taskItem node`, () => {
  it('serializes to <li> with proper data-attributes', () => {
    const html = toHTML(schema.nodes.taskItem.create(), schema);
    expect(html).toContain('<li');
    expect(html).toContain('data-task-local-id');
    expect(html).toContain('data-task-state');
  });

  it('matches <li data-task-local-id>', () => {
    const doc = fromHTML('<li data-task-local-id>', schema);
    const taskItem = doc.firstChild!.firstChild!;
    expect(taskItem.type.name).toEqual('taskItem');
  });

  it('does not match <li>', () => {
    const doc = fromHTML('<li>', schema);
    const listItem = doc.firstChild!.firstChild!;
    expect(listItem.type.name).toEqual('listItem');
  });

  it('taskItem requires defining to be true', () => {
    expect(schema.nodes.taskItem.spec.defining).toBe(true);
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
