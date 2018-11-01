import {
  createEditor,
  doc,
  p,
  typeAheadQuery,
  insertText,
  em,
} from '@atlaskit/editor-test-helpers';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';

describe('typeAhead input rules', () => {
  it('should convert trigger to a typeAheadQuery', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/', sel);
    expect(editorView.state.doc).toEqualDocument(
      doc(p(typeAheadQuery({ trigger: '/' })('/'))),
    );
  });

  it('should not duplicate previous char', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('.{<>}')),
      editorPlugins: [plugin],
    });

    insertText(editorView, '/', sel);
    expect(editorView.state.doc).toEqualDocument(
      doc(p('.', '{<>}', typeAheadQuery({ trigger: '/' })('/'))),
    );
  });

  it('should not show typeahead for key combination (/', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('({<>}')),
      editorPlugins: [plugin],
    });

    insertText(editorView, '/', sel);
    expect(editorView.state.doc).toEqualDocument(doc(p('(/')));
  });

  it('should preserve marks that were applied before typeAheadQuery', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p(em('hello {<>}'))),
      editorPlugins: [plugin],
    });

    insertText(editorView, '/', sel);

    expect(editorView.state.doc).toEqualDocument(
      doc(p(em('hello '), em(typeAheadQuery({ trigger: '/' })('/')))),
    );
  });
});
