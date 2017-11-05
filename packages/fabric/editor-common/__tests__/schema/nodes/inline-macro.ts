import { name } from '../../../package.json';
import { schema, toDOM, fromHTML } from '../../../test-helpers';
import { inlineMacro } from '../../../src';

describe(`${name}/schema inlineMacro node`, () => {
  describe('parse html', () => {
    it('converts to inline macro', () => {
      const doc = fromHTML(`
        <span
          data-node-type="inlineMacro"
        />
        `, schema);

      const inlineMacroNode = doc.firstChild!.firstChild!;

      expect(inlineMacroNode.type.spec).toEqual(inlineMacro);
    });

    it('gets attributes from html', () => {
      const macroId = '12345';
      const name = 'status';
      const placeholderUrl = 'www.google.com/placeholder.png';
      const params = '{"color": "yellow", "text": "In progress"}';
      const doc = fromHTML(`
      <span
        data-node-type="inlineMacro"
        data-macro-id="${macroId}"
        data-name="${name}"
        data-placeholder-url="${placeholderUrl}"
        data-params='${params}'
      />
      `, schema);

      const inlineMacroNode = doc.firstChild!.firstChild!;

      expect(inlineMacroNode.attrs.macroId).toEqual(macroId);
      expect(inlineMacroNode.attrs.name).toEqual(name);
      expect(inlineMacroNode.attrs.placeholderUrl).toEqual(placeholderUrl);
      expect(inlineMacroNode.attrs.params).toEqual({ color: 'yellow', text: 'In progress' });
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const macroId = 'abcdefg';
      const name = 'status';
      const placeholderUrl = 'www.google.com/placeholder.png';
      const params = { color: 'green', text: 'Decided' };

      const inlineMacroNode = schema.nodes.inlineMacro.create({macroId, name, placeholderUrl, params});

      const inlineMacroDOM = toDOM(inlineMacroNode, schema).firstChild as HTMLElement;

      expect(inlineMacroDOM.getAttribute('data-node-type')).toEqual('inlineMacro');
      expect(inlineMacroDOM.getAttribute('data-macro-id')).toEqual(macroId);
      expect(inlineMacroDOM.getAttribute('data-name')).toEqual(name);
      expect(inlineMacroDOM.getAttribute('data-placeholder-url')).toEqual(placeholderUrl);
      expect(inlineMacroDOM.getAttribute('data-params')).toEqual('{"color":"green","text":"Decided"}');
    });

    it('encodes and decodes to the same node', () => {
      const macroId = '56789';
      const name = 'aInlineMacro';
      const placeholderUrl = 'www.google.com/placeholder.png';
      const params = { color: 'red', text: 'At risk' };

      const inlineMacroNode = schema.nodes.inlineMacro.create({macroId, name, placeholderUrl, params});

      const inlineMacroDOM = toDOM(inlineMacroNode, schema).firstChild as HTMLElement;
      const parsedInlineMacro = fromHTML(inlineMacroDOM.outerHTML, schema).firstChild!.firstChild!;

      expect(parsedInlineMacro).toEqual(inlineMacroNode);
    });
  });
});
