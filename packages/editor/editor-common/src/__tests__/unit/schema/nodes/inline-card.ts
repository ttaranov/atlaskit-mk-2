import { name } from '../../../../../package.json';
import { toDOM, fromHTML } from '../../../../../test-helpers';
import { createSchema, inlineCard } from '../../../..';

describe(`${name}/schema inlineCard node`, () => {
  const schema = createSchema({
    nodes: ['doc', 'paragraph', 'inlineCard', 'text'],
  });

  const url = 'https://product-fabric.atlassian.net/browse/ED-1';

  describe('parse html', () => {
    it('converts to inlineCard PM node', () => {
      const doc = fromHTML(`<span data-card-url="${url}" />`, schema);
      const node = doc.firstChild!.firstChild!;
      expect(node.type.spec).toEqual(inlineCard);
    });

    it('gets attributes from html', () => {
      const doc = fromHTML(`<span data-card-url="${url}" />`, schema);

      const node = doc.firstChild!.firstChild!;
      expect(node.attrs.url).toEqual(url);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const dom = toDOM(schema.nodes.inlineCard.create({ url }), schema)
        .firstChild as HTMLElement;

      expect(dom.getAttribute('data-card-url')).toEqual(url);
    });

    it('encodes and decodes to the same node', () => {
      const node = schema.nodes.inlineCard.create({ url });
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
        .firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
