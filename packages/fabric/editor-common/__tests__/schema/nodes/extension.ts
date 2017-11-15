import { name } from '../../../package.json';
import { schema, toDOM, fromHTML } from '../../../test-helpers';
import { extension } from '../../../src';

describe(`${name}/schema extension node`, () => {
  describe('parse html', () => {
    it('converts to extension PM node', () => {
      const doc = fromHTML(
        '<div data-extension-type="com.atlassian.confluence.macro" />',
        schema
      );
      const node = doc.firstChild!;
      expect(node.type.spec).toEqual(extension);
    });

    it('gets attributes from html', () => {
      const extensionType = 'com.atlassian.confluence.macro';
      const extensionKey = 'code';
      const parameters = { macroparams: { language: 'cpp' } };
      const bodyType = 'plain';

      const doc = fromHTML(
        `
        <div
          data-extension-type="${extensionType}"
          data-extension-key="${extensionKey}"
          data-body-type="${bodyType}"
          data-parameters='${JSON.stringify(parameters)}'
        >const x = 4;</div>
      `,
        schema
      );

      const node = doc.firstChild!;
      expect(node.attrs.extensionType).toEqual(extensionType);
      expect(node.attrs.extensionKey).toEqual(extensionKey);
      expect(node.attrs.parameters).toEqual(parameters);
      expect(node.attrs.bodyType).toEqual(bodyType);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro',
        extensionKey: 'code',
        bodyType: 'plain',
        parameters: { macroparams: { language: 'cpp' } },
      };
      // extension node can contain no content
      const node = schema.nodes.extension.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;

      expect(dom.getAttribute('data-extension-type')).toEqual(
        attrs.extensionType
      );
      expect(dom.getAttribute('data-extension-key')).toEqual(
        attrs.extensionKey
      );
      expect(dom.getAttribute('data-body-type')).toEqual(attrs.bodyType);
      expect(dom.getAttribute('data-parameters')).toEqual(
        JSON.stringify(attrs.parameters)
      );
    });

    it('encodes and decodes to the same node', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro',
        extensionKey: 'code',
        bodyType: 'plain',
        parameters: { macroparams: { language: 'cpp' } },
      };
      const content = schema.nodes.paragraph.create(
        schema.text('const x = 4;')
      );
      const node = schema.nodes.extension.create(attrs, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
