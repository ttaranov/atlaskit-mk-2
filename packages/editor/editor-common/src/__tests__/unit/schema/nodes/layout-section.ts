import { name } from '../../../../../package.json';
import { createSchema } from '../../../../..';
import { fromHTML, toHTML, toContext } from '../../../../../test-helpers';
import {
  layoutSection,
  layoutColumn,
  doc,
  p,
} from '@atlaskit/editor-test-helpers';

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
    expect(node.attrs.layoutType).toEqual('two_equal');
  });

  it('matches <div data-layout-type="*" /> and defaults to `two_equal` when unknown layout_type', () => {
    const doc = fromHTML(
      '<div data-layout-type="five_hundred_equal" />',
      schema,
    );
    const node = doc.firstChild!;
    expect(node.type.name).toEqual('layoutSection');
    expect(node.attrs.layoutType).toEqual('two_equal');
  });

  it('should not match <div data-layout-type="*" /> when pasted inside layoutSection', () => {
    const document = doc(
      layoutSection()(layoutColumn(p('{<>}')), layoutColumn(p(''))),
    );
    const context = toContext(document, schema);
    const pmDoc = fromHTML(
      '<div data-layout-type="two_equal"><p>Text</p></div>',
      schema,
      { context },
    );
    const node = pmDoc.firstChild!;
    expect(node.type.name).toEqual('paragraph');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'layoutSection', 'layoutColumn', 'paragraph', 'text'],
  });
}
