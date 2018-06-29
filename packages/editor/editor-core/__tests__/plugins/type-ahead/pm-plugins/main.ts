import {
  createEditor,
  doc,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';

describe('typeAhead main plugin', () => {
  it('should close typeahed if a query starts with a space', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/ ', sel);
    expect(editorView.state.doc).toEqualDocument(doc(p('/ ')));
  });
});
