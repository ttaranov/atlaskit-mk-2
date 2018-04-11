import {
  createEditor,
  doc,
  p,
  typeAheadQuery,
  insertText,
} from '@atlaskit/editor-test-helpers';

const createTypeAheadPlugin = ({
  getItems,
  selectItem,
}: {
  getItems?: Function;
  selectItem?: Function;
} = {}) => {
  return {
    pluginsOptions: {
      typeAhead: {
        trigger: '/',
        getItems:
          getItems !== undefined
            ? getItems
            : () => [{ title: '1' }, { title: '2' }, { title: '3' }],
        selectItem:
          selectItem !== undefined
            ? selectItem
            : (state, item, replaceWith) =>
                replaceWith(state.schema.text(`${item.title} selected`)),
      },
    },
  };
};

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
});
