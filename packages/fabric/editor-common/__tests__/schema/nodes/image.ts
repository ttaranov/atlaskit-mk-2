import { name } from '../../../package.json';
import { createSchema } from '../../../src';
import { fromHTML, toHTML } from '../../../test-helpers';

const schema = makeSchema();
const src = 'http://test.com';

describe(`${name}/schema image node`, () => {
  it('serializes to <img>', () => {
    const html = toHTML(schema.nodes.image.create({ src }), schema);
    expect(html).toContain(`<img src="${src}">`);
  });

  it('matches <img src="...">', () => {
    const doc = fromHTML(`<img src="${src}" />`, schema);
    const img = doc.firstChild!.firstChild!;
    expect(img.type.name).toEqual('image');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'image'],
  });
}
