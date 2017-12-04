import { name } from '../../../package.json';
import { createSchema } from '../../../src';
import { fromHTML, toHTML } from '../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema heading node`, () => {
  it('serializes to <h4>', () => {
    const html = toHTML(schema.nodes.heading.create({ level: 4 }), schema);
    expect(html).toContain('<h4>');
  });

  it('matches <h3>', () => {
    const doc = fromHTML('<h3>', schema);
    const h3 = doc.firstChild!;
    expect(h3.type.name).toEqual('heading');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'heading'],
  });
}
