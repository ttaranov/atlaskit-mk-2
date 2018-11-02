import {
  createEditor,
  doc,
  p,
  blockquote,
  typeAheadQuery,
  date,
  status,
} from '@atlaskit/editor-test-helpers';
import {
  selectCurrentItem,
  selectSingleItemOrDismiss,
  selectByIndex,
  selectItem,
} from '../../../../../plugins/type-ahead/commands/select-item';
import { datePlugin, statusPlugin } from '../../../../../plugins';

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
            : (state, item, insert) =>
                insert(state.schema.text(`${item.title} selected`)),
      },
    },
  };
};

describe('selectCurrentItem', () => {
  it("should call handler's selectItem method", () => {
    const fn = jest.fn(state => state.tr);
    const plugin = createTypeAheadPlugin({ selectItem: fn });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectCurrentItem()(editorView.state, editorView.dispatch);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should update document when item is selected', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectCurrentItem()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('1 selected')));
  });

  it("should have a fallback behaviour in cases where selectItem doesn't exist on a handler", () => {
    const plugin = createTypeAheadPlugin({ selectItem: null } as any);
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectCurrentItem()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
  });

  it('should have a fallback behaviour in cases where selectItem returns false', () => {
    const plugin = createTypeAheadPlugin({ selectItem: () => false });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectCurrentItem()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
  });
});

describe('selectSingleItemOrDismiss', () => {
  it('should select the only item', () => {
    const plugin = createTypeAheadPlugin({
      getItems: () => [{ title: 'only' }],
    });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectSingleItemOrDismiss()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('only selected')));
  });

  it('should dismiss typeAheadQuery if there is no items to select from', () => {
    const plugin = createTypeAheadPlugin({
      getItems: () => [],
    });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectSingleItemOrDismiss()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
  });
});

describe('selectItemByIndex', () => {
  it('should select item by index', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectByIndex(2)(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('3 selected')));
  });

  it("should return false if item with the provided index doesn't exist", () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    expect(selectByIndex(20)(editorView.state, editorView.dispatch)).toBe(
      false,
    );
  });
});

describe('selectItem', () => {
  it('should add trailing space when replacing type ahead query specifying addTrailingSpace option', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{Status}'))),
      editorPlugins: [plugin, statusPlugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, insert) =>
          insert(
            state.schema.nodes.status.createChecked({
              text: 't',
              color: 'c',
              localId: 'id',
            }),
            { addTrailingSpace: true },
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(
          status({
            text: 't',
            color: 'c',
            localId: 'id',
          }),
          ' ',
        ),
      ),
    );
  });

  it('should not add trailing space when replacing type ahead query without addTrailingSpace option', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin, datePlugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, insert) =>
          insert(
            state.schema.nodes.date.createChecked({ timestamp: item.title }),
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(
      doc(p(date({ timestamp: '1' }))),
    );
  });

  it('should accept text', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin, datePlugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, insert) => insert('some text'),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('some text')));
  });

  it('should not add a space when replacing a type ahead query with a text node', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, replaceWith) =>
          replaceWith(state.schema.text(item.title)),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('1')));
  });

  it('should not remove any unrelated characters when replacing a type ahead query with an inline node', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'), 'content')),
      editorPlugins: [plugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, replaceWith) =>
          replaceWith(state.schema.text(`${item.title} `)),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('1 content')));
  });

  it('should replace an empty paragraph node with insert block node', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, replaceWith) =>
          replaceWith(
            state.schema.nodes.blockquote.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(
                {},
                state.schema.text('quote'),
              ),
            ),
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('quote'))));
  });

  it('should insert a block node below non-empty node', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p('some text ', typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, replaceWith) =>
          replaceWith(
            state.schema.nodes.blockquote.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(
                {},
                state.schema.text('quote'),
              ),
            ),
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(p('some text '), blockquote(p('quote'))),
    );
  });

  it('should select inserted inline node when selectInlineNode is specified', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin, datePlugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, insert) =>
          insert(
            state.schema.nodes.date.createChecked({ timestamp: item.title }),
            { selectInlineNode: true },
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);

    expect(editorView.state.selection.from).toEqual(1);
    expect(editorView.state.selection.to).toEqual(2);
  });

  it("should move cursor after inline node when selectInlineNode isn't specified", () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
      editorPlugins: [plugin, datePlugin],
    });
    selectItem(
      {
        trigger: '/',
        selectItem: (state, item, insert) =>
          insert(
            state.schema.nodes.date.createChecked({ timestamp: item.title }),
          ),
        getItems: () => [],
      },
      { title: '1' },
    )(editorView.state, editorView.dispatch);

    expect(editorView.state.selection.from).toEqual(2);
    expect(editorView.state.selection.to).toEqual(2);
  });
});
