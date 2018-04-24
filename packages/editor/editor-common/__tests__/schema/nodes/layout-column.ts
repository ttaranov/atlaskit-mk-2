import { name } from '../../../package.json';
import { createSchema } from '../../../src';
import { fromHTML, toHTML } from '../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema layout-column node`, () => {
  it('serializes to <div />', () => {
    const html = toHTML(schema.nodes.layoutColumn.create(), schema);
    expect(html).toContain('<div>');
  });

  it('matches <div /> inside layoutSection', () => {
    const doc = fromHTML(
      '<div data-layout-type="two_equal"><div /></div>',
      schema,
    );
    const node = doc.firstChild!.firstChild!;
    expect(node.type.name).toEqual('layoutColumn');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
  });
}
