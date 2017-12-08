import { name } from '../../../package.json';
import { schema, toDOM, fromHTML } from '../../../test-helpers';

describe(`${name}/schema mediaSingle node`, () => {
  describe('parse html', () => {
    it('gets attributes from html', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-alignment="left"
          data-display="inline-block"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.type).toEqual(schema.nodes.mediaSingle);
      expect(mediaSingleNode.attrs.alignment).toEqual('left');
      expect(mediaSingleNode.attrs.display).toEqual('inline-block');
    });

    it('auto creates a media node inside mediaSingle node', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="mediaSingle"
          data-alignment="left"
          data-display="block"
        />
        `,
        schema,
      );

      const mediaSingleNode = doc.firstChild!;

      expect(mediaSingleNode.childCount).toEqual(1);
      expect(mediaSingleNode.child(0)).toEqual(schema.nodes.media.create());
    });
  });

  describe('encode node', () => {
    it('converts attributes to related data attribute in html', () => {
      const mediaSingleNode = schema.nodes.mediaSingle.create({
        alignment: 'right',
        display: 'block',
      });

      const mediaSingleDom = toDOM(mediaSingleNode, schema)
        .firstChild as HTMLElement;
      const alignment = mediaSingleDom.getAttribute('data-alignment');
      const display = mediaSingleDom.getAttribute('data-display');
      const nodeType = mediaSingleDom.getAttribute('data-node-type');

      expect(alignment).toEqual('right');
      expect(display).toEqual('block');
      expect(nodeType).toEqual('mediaSingle');
    });
  });

  it('encodes and decodes to the same node', () => {
    const { mediaSingle, media } = schema.nodes;
    const mediaSingleNode = mediaSingle.create(
      {
        alignment: 'center',
        display: 'inline-block',
      },
      media.create(),
    );

    const mediaSingleDom = toDOM(mediaSingleNode, schema)
      .firstChild as HTMLElement;

    const parsedMediaSingle = fromHTML(mediaSingleDom.outerHTML, schema)
      .firstChild;

    expect(parsedMediaSingle).toEqual(mediaSingleNode);
  });
});
