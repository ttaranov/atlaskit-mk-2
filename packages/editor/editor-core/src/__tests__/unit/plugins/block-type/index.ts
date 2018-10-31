import {
  createEditor,
  blockquote,
  insertText,
  code_block,
  panel,
  doc,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
} from '@atlaskit/editor-test-helpers';
import {
  pluginKey as blockTypePluginKey,
  BlockTypeState,
} from '../../../../plugins/block-type/pm-plugins/main';
import { setTextSelection } from '../../../../utils';
import codeBlockPlugin from '../../../../plugins/code-block';
import panelPlugin from '../../../../plugins/panel';
import listPlugin from '../../../../plugins/lists';
import {
  setBlockType,
  insertBlockType,
} from '../../../../plugins/block-type/commands';
import { HEADING_1 } from '../../../../plugins/block-type/types';

describe('block-type', () => {
  const editor = (doc: any) =>
    createEditor<BlockTypeState>({
      doc,
      editorPlugins: [codeBlockPlugin(), panelPlugin, listPlugin],
      pluginKey: blockTypePluginKey,
    });

  it('should be able to change to normal', () => {
    const { editorView } = editor(doc(h1('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    editorView.destroy();
  });

  [h1, h2, h3, h4, h5, h6].forEach((builder, idx) => {
    const level = idx + 1;

    it(`should be able to change to heading${level}`, () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      setBlockType(`heading${level}`)(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(builder('text')));
      editorView.destroy();
    });
  });

  it('should be able to change to block quote', () => {
    const { editorView } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    insertBlockType('blockquote')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));
    editorView.destroy();
  });

  describe('when rendering a block quote', () => {
    it('should not be selectable', () => {
      const { editorView } = editor(doc(blockquote(p('{<>}text'))));
      const node = editorView.state.doc.nodeAt(0);

      if (node) {
        expect(node.type.spec.selectable).toBe(false);
      }
      editorView.destroy();
    });
  });

  describe('code block', () => {
    it('should be able to insert code block', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      insertBlockType('codeblock')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('te'), code_block()(), p('xt')),
      );
      editorView.destroy();
    });
  });

  it('should be able to identify normal', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should have all of the present blocks type panel, blockQuote, codeBlock in availableWrapperBlockTypes', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));
    expect(pluginState.availableWrapperBlockTypes.length).toBe(3);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'panel',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'codeblock',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'blockquote',
      ),
    ).toBe(true);
  });

  it('should be able to identify normal even if there are multiple blocks', () => {
    const { pluginState } = editor(doc(p('te{<}xt'), p('text'), p('te{>}xt')));
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should set currentBlockType to Other if there are blocks of multiple types', () => {
    const { pluginState } = editor(doc(p('te{<}xt'), h1('text'), p('te{>}xt')));
    expect(pluginState.currentBlockType.name).toBe('other');
  });

  it('should be able to identify heading1', () => {
    const { pluginState } = editor(doc(h1('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading1');
  });

  it('should be able to identify heading2', () => {
    const { pluginState } = editor(doc(h2('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading2');
  });

  it('should be able to identify heading3', () => {
    const { pluginState } = editor(doc(h3('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading3');
  });

  it('should be able to change to back to paragraph and then change to blockquote', () => {
    const { editorView } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    insertBlockType('blockquote')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));
    editorView.destroy();
  });

  it('should not toggle block type', () => {
    const { editorView } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    editorView.destroy();
  });

  it('should be able to change block types when selecting two nodes', () => {
    const { editorView } = editor(doc(p('li{<}ne1'), p('li{>}ne2')));
    const { state, dispatch } = editorView;

    setBlockType('heading1')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(h1('line1'), h1('line2')));
    editorView.destroy();
  });

  it('should be able to change multiple paragraphs into one blockquote', () => {
    const { editorView } = editor(
      doc(p('li{<}ne1'), p('li{>}ne2'), p('li{>}ne3')),
    );
    const { state, dispatch } = editorView;

    insertBlockType('blockquote')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(
      doc(blockquote(p('li{<}ne1'), p('li{>}ne2'), p('li{>}ne3'))),
    );
    editorView.destroy();
  });

  it('should change state when selecting different block types', () => {
    const { editorView, refs } = editor(
      doc(h1('te{h1Pos}xt'), p('te{pPos}xt')),
    );
    const { h1Pos, pPos } = refs;

    setTextSelection(editorView, h1Pos);
    expect(
      blockTypePluginKey.getState(editorView.state).currentBlockType.name,
    ).toBe('heading1');

    setTextSelection(editorView, pPos);
    expect(
      blockTypePluginKey.getState(editorView.state).currentBlockType.name,
    ).toBe('normal');
    editorView.destroy();
  });

  it('should dispatch events in response to changes', () => {
    const { pluginState, editorView, eventDispatcher } = editor(
      doc(p('te{<>}xt')),
    );
    const { state, dispatch } = editorView;
    const spy = jest.fn();

    eventDispatcher.on((blockTypePluginKey as any).key, spy);
    setBlockType('heading1')(state, dispatch);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      ...pluginState,
      currentBlockType: HEADING_1,
    });
    editorView.destroy();
  });

  describe('toggleBlockType', () => {
    describe('when origin block type is the same as target block type', () => {
      it('does not convert to a paragraph', () => {
        const { editorView } = editor(doc(h1('text')));
        const { state, dispatch } = editorView;

        setBlockType('heading1')(state, dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(h1('text')));
        editorView.destroy();
      });
    });
  });

  describe('insertBlockType', () => {
    it('should be able to insert panel', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(panel()(p())));
      editorView.destroy();
    });

    it('should wrap current selection in panel if possible', () => {
      const { editorView } = editor(doc(h1('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(h1('test{<>}'))),
      );
      editorView.destroy();
    });

    it('should be able to insert panel after current selection if current selection can not be wrapper in panel', () => {
      const { editorView } = editor(doc(blockquote(p('test{<>}'))));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('test')), panel()(p())),
      );
      editorView.destroy();
    });

    it('should be able to insert blockquote', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
      editorView.destroy();
    });

    it('should wrap current selection in blockquote if possible', () => {
      const { editorView } = editor(doc(p('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('test{<>}'))),
      );
      editorView.destroy();
    });

    it('should be able to insert blockquote after current selection if current selection can not be wrapper in blockquote', () => {
      const { editorView } = editor(doc(h1('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(h1('test'), blockquote(p())),
      );
      editorView.destroy();
    });

    it('should be able to insert codeblock', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('codeblock')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p(), code_block()()));
      editorView.destroy();
    });

    it('should insert code block after selection if selected block has text', () => {
      const { editorView } = editor(doc(p('text{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('codeblock')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('text{<>}'), code_block()()),
      );
      editorView.destroy();
    });
  });

  describe('blockTypesDisabled', () => {
    it('should be false if current selection has no wrapper', () => {
      const { pluginState } = editor(doc(p('text{<>}')));
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be false if current selection is wrapped in panel', () => {
      const { pluginState } = editor(doc(panel()(p('text{<>}'))));
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be true if current selection is wrapped in blockquote', () => {
      const { pluginState } = editor(doc(blockquote(p('text{<>}'))));
      expect(pluginState.blockTypesDisabled).toBe(true);
    });

    it('should be true if current selection is wrapped in codeblock', () => {
      const { pluginState } = editor(doc(code_block()('testing{<>}')));
      expect(pluginState.blockTypesDisabled).toBe(true);
    });
  });

  describe('block type in comment editor', () => {
    const editor = (doc: any) =>
      createEditor({
        doc,
        editorProps: { appearance: 'comment', allowCodeBlocks: true },
      });

    it('should create empty terminal empty paragraph when heading is created', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h1(''), p('')));
    });

    it('should create empty terminal empty paragraph when code block is created', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '```', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()(''), p('')),
      );
    });
  });
});
