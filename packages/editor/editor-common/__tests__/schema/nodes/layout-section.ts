import { name } from '../../../package.json';
import { createSchema } from '../../../src';
import { fromHTML, toHTML } from '../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema layout-section node`, () => {
  it('serializes to <div data-layout-type="*"/>', () => {
    const html = toHTML(schema.nodes.layoutSection.create(), schema);
    expect(html).toContain('<div data-layout-type="two_equal">');
  });

  it('matches <div data-layout-type="*" />', () => {
    const doc = fromHTML('<div data-layout-type="two_equal" />', schema);
    const node = doc.firstChild!;
    expect(node.type.name).toEqual('layoutSection');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
  });
}
