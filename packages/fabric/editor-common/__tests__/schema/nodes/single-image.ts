import { name } from '../../../package.json';
import { schema, toDOM, fromHTML } from '../../../test-helpers';

describe(`${name}/schema single image node`, () => {
  describe('parse html', () => {
    it('gets attributes from html', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="singleImage"
          data-alignment="left"
          data-display="inline-block"
        />
        `,
        schema,
      );

      const singleImageNode = doc.firstChild!;

      expect(singleImageNode.type).toEqual(schema.nodes.singleImage);
      expect(singleImageNode.attrs.alignment).toEqual('left');
      expect(singleImageNode.attrs.display).toEqual('inline-block');
    });

    it('auto creates a media node inside single image node', () => {
      const doc = fromHTML(
        `
        <div
          data-node-type="singleImage"
          data-alignment="left"
          data-display="block"
        />
        `,
        schema,
      );

      const singleImageNode = doc.firstChild!;

      expect(singleImageNode.childCount).toEqual(1);
      expect(singleImageNode.child(0)).toEqual(schema.nodes.media.create());
    });
  });

  describe('encode node', () => {
    it('converts attributes to related data attribute in html', () => {
      const singleImageNode = schema.nodes.singleImage.create({
        alignment: 'right',
        display: 'block',
      });

      const singleImageDom = toDOM(singleImageNode, schema)
        .firstChild as HTMLElement;
      const alignment = singleImageDom.getAttribute('data-alignment');
      const display = singleImageDom.getAttribute('data-display');
      const nodeType = singleImageDom.getAttribute('data-node-type');

      expect(alignment).toEqual('right');
      expect(display).toEqual('block');
      expect(nodeType).toEqual('singleImage');
    });
  });

  it('encodes and decodes to the same node', () => {
    const { singleImage, media } = schema.nodes;
    const singleImageNode = singleImage.create(
      {
        alignment: 'center',
        display: 'inline-block',
      },
      media.create(),
    );

    const singleImageDom = toDOM(singleImageNode, schema)
      .firstChild as HTMLElement;

    const parsedSingleImage = fromHTML(singleImageDom.outerHTML, schema)
      .firstChild;

    expect(parsedSingleImage).toEqual(singleImageNode);
  });
});
