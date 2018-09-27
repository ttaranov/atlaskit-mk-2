import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { fromHTML, toHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema rule node`, () => {
  it('serializes to <hr/>', () => {
    const html = toHTML(schema.nodes.rule.create(), schema);
    expect(html).toContain('<hr>');
  });

  it('matches <hr/>', () => {
    const doc = fromHTML('<hr/>', schema);
    const p = doc.firstChild!;
    expect(p.type.name).toEqual('rule');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'rule', 'text'],
  });
}
