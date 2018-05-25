import { stateKey as codeBlockPluginKey } from '../../../src/plugins/code-block/pm-plugins/main';
import {
  code_block,
  doc,
  createEditor,
  p,
  createEvent,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers';
import { setTextSelection } from '../../../src/utils';
import codeBlockPlugin from '../../../src/plugins/code-block';
import tablesPlugin from '../../../src/plugins/table';

describe('code-block', () => {
  const editor = (doc: any) => {
    const editor = createEditor({
      doc,
      editorPlugins: [codeBlockPlugin, tablesPlugin],
    });
    const pluginState = codeBlockPluginKey.getState(editor.editorView.state);
    const plugin = editor.editorView.state.plugins.find(
      (p: any) => p.key === (codeBlockPluginKey as any).key,
    );

    return { ...editor, pluginState, plugin: plugin! };
  };

  const event = createEvent('event');

  describe('subscribe', () => {
    it('calls subscriber with plugin', () => {
      const { pluginState } = editor(doc(p('paragraph')));
      const spy = jest.fn();
      pluginState.subscribe(spy);

      expect(spy).toHaveBeenCalledWith(pluginState);
    });

    describe('when leaving code block', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('paragraph{pPos}'), code_block()('codeBlock{<>}')),
        );
        const spy = jest.fn();
        const { pPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, pPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when entering code block', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('paragraph{<>}'), code_block()('codeBlock{cbPos}')),
        );
        const spy = jest.fn();
        const { cbPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, cbPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when moving to a different code block', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(code_block()('codeBlock{<>}'), code_block()('codeBlock{cbPos}')),
        );
        const spy = jest.fn();
        const { cbPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, cbPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when moving within the same code block', () => {
      it('does not notify subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(code_block()('{<>}codeBlock{cbPos}')),
        );
        const spy = jest.fn();
        const { cbPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, cbPos);

        expect(spy).not.toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when code block is focused and then editor is blur', () => {
      it('should call subscribers', () => {
        const { pluginState, editorView, plugin } = editor(
          doc(p('paragraph'), code_block()('code{<>}Block')),
        );
        const spy = jest.fn();
        pluginState.subscribe(spy);

        plugin.props.handleDOMEvents!.blur(editorView, event);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when code block is not focused and then editor is blur', () => {
      it('should not call subscribers', () => {
        const { pluginState, editorView, plugin } = editor(
          doc(p('para{<>}graph'), code_block()('codeBlock')),
        );
        const spy = jest.fn();
        pluginState.subscribe(spy);

        plugin.props.handleDOMEvents!.blur(editorView, event);

        expect(spy).toHaveBeenCalledTimes(1);
        editorView.destroy();
      });
    });

    describe('when click inside code_block', () => {
      it('notify the subscriber', () => {
        const { plugin, pluginState, editorView, sel } = editor(
          doc(p('paragraph'), code_block()('codeBlock{<>}')),
        );
        const spy = jest.fn();
        pluginState.subscribe(spy);

        plugin.props.handleClick!(editorView, sel, event);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when click outside of code_block', () => {
      it('does not notify the subscriber', () => {
        const { plugin, editorView, pluginState, sel } = editor(
          doc(p('paragraph{<>}')),
        );
        const spy = jest.fn();
        pluginState.subscribe(spy);

        plugin.props.handleClick!(editorView, sel, event);

        expect(spy).toHaveBeenCalledTimes(1);
        editorView.destroy();
      });
    });

    describe('when unsubscribe', () => {
      it('does not notify the subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('paragraph{<>}'), code_block()('codeBlock{cbPos}')),
        );
        const spy = jest.fn();
        const { cbPos } = refs;
        pluginState.subscribe(spy);

        pluginState.unsubscribe(spy);
        setTextSelection(editorView, cbPos);

        expect(spy).not.toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });
  });

  describe('element', () => {
    describe('when cursor moves within the same code block', () => {
      it('returns the same element', () => {
        const { refs, pluginState, editorView } = editor(
          doc(code_block()('code{<>}Block{cbPos}')),
        );
        const { cbPos } = refs;

        const previousElement = pluginState.element;
        setTextSelection(editorView, cbPos);

        const currentElement = pluginState.element;

        expect(previousElement).toEqual(currentElement);
        editorView.destroy();
      });
    });

    describe('when cursor moves onto different code block', () => {
      it('returns different elements', () => {
        const { refs, pluginState, editorView } = editor(
          doc(
            code_block()('one{<>} codeBlock'),
            code_block()('another{cbPos} codeBlock'),
          ),
        );
        const { cbPos } = refs;

        const previousElement = pluginState.element;
        setTextSelection(editorView, cbPos);

        const currentElement = pluginState.element;

        expect(previousElement).not.toEqual(currentElement);
        editorView.destroy();
      });
    });

    describe('when cursor is within a code block', () => {
      describe('when at the end of the code block', () => {
        it('returns code block element', () => {
          const { pluginState } = editor(
            doc(p('paragraph'), code_block()('codeBlock{<>}')),
          );

          expect(pluginState.element instanceof HTMLElement).toBe(true);
        });
      });

      describe('when at the beginning of the code block', () => {
        it('returns code block element', () => {
          const { editorView, pluginState, sel } = editor(
            doc(p('paragraph'), code_block()('{<>}codeBlock')),
          );

          // -1 to move from the start of the node, to before the node
          const codeBlockDOM = editorView.domAtPos(sel - 1);
          expect(pluginState.element).toBe(
            codeBlockDOM.node.childNodes[codeBlockDOM.offset],
          );
        });
      });

      describe('when at the middle of the code block', () => {
        it('returns code block element', () => {
          const { editorView, pluginState, sel } = editor(
            doc(p('paragraph'), code_block()('code{<>}Block')),
          );

          const codeBlockDOM = editorView.domAtPos(
            editorView.state.doc.resolve(sel).before(),
          );
          expect(pluginState.element).toBe(
            codeBlockDOM.node.childNodes[codeBlockDOM.offset],
          );
        });
      });
    });

    describe('when cursor is out of code block', () => {
      it('returns undefined', () => {
        const { pluginState } = editor(
          doc(p('paragraph{<>}'), code_block()('codeBlock')),
        );

        expect(pluginState.element).toBe(undefined);
      });
    });
  });

  describe('clicked', () => {
    describe('when click inside code block', () => {
      it('returns true', () => {
        const { plugin, editorView, pluginState, sel } = editor(
          doc(p('paragraph'), code_block()('code{<>}Block')),
        );

        plugin.props.handleClick!(editorView, sel, event);

        expect(pluginState.domEvent).toBe(true);
        editorView.destroy();
      });
    });

    describe('when click outside of code block', () => {
      it('returns false', () => {
        const { plugin, editorView, pluginState, sel } = editor(
          doc(p('paragraph{<>}'), code_block()('codeBlock')),
        );

        plugin.props.handleClick!(editorView, sel, event);

        expect(pluginState.domEvent).toBe(false);
        editorView.destroy();
      });
    });

    describe('when has not been clicked', () => {
      it('returns false', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('paragraph'), code_block()('codeB{cbPos}lock')),
        );
        const { cbPos } = refs;

        setTextSelection(editorView, cbPos);

        expect(pluginState.domEvent).toBe(false);
        editorView.destroy();
      });
    });
  });

  describe('updateLanguage', () => {
    it('keeps the content', () => {
      const { pluginState, editorView } = editor(
        doc(p('paragraph'), code_block({ language: 'java' })('{<>}codeBlock')),
      );
      const previousElement = pluginState.element;

      pluginState.updateLanguage('php', editorView);

      const currentElement = pluginState.element;

      expect(previousElement!.textContent).toEqual(currentElement!.textContent);
      editorView.destroy();
    });

    it('can update language to be undefined', () => {
      const { pluginState, editorView } = editor(
        doc(p('paragraph'), code_block({ language: 'java' })('{<>}codeBlock')),
      );

      pluginState.updateLanguage(undefined, editorView);

      expect(pluginState.language).toBe(undefined);
      editorView.destroy();
    });

    it('updates language', () => {
      const { pluginState, editorView } = editor(
        doc(p('paragraph'), code_block({ language: 'java' })('{<>}codeBlock')),
      );

      pluginState.updateLanguage('php', editorView);

      expect(pluginState.language).toEqual('php');
      editorView.destroy();
    });

    it('updates the node', () => {
      const { pluginState, editorView } = editor(
        doc(p('paragraph'), code_block({ language: 'java' })('{<>}codeBlock')),
      );
      const previousActiveCodeBlock = pluginState.activeCodeBlock;

      pluginState.updateLanguage('php', editorView);

      const currentActiveCodeBlock = pluginState.activeCodeBlock;

      expect(previousActiveCodeBlock).not.toBe(currentActiveCodeBlock);
      editorView.destroy();
    });
  });

  describe('removeCodeBlock', () => {
    it('should change current code_block to simple paragraph', () => {
      const { pluginState, editorView } = editor(
        doc(code_block({ language: 'java' })('{<>}codeBlock')),
      );
      pluginState.removeCodeBlock(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
      editorView.destroy();
    });

    it('should not remove parent block when removing code_block', () => {
      const { pluginState, editorView } = editor(
        doc(
          table()(
            tr(td({})(code_block({ language: 'java' })('codeBlock{<>}'))),
          ),
        ),
      );
      pluginState.removeCodeBlock(editorView);
      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(td({})(p())))),
      );
      editorView.destroy();
    });
  });

  describe('language', () => {
    it('is the same as activeCodeBlock language', () => {
      const { pluginState } = editor(
        doc(code_block({ language: 'java' })('te{<>}xt')),
      );

      expect(pluginState.language).toEqual('java');
    });

    it('updates if activeCodeBlock updates langugae', () => {
      const { pluginState, editorView } = editor(
        doc(code_block({ language: 'java' })('te{<>}xt')),
      );

      pluginState.updateLanguage('php', editorView);

      expect(pluginState.language).toEqual('php');
      editorView.destroy();
    });

    it('sets language to null if no activeCodeBlock', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.language).toBe(undefined);
    });
  });

  describe('toolbarVisible', () => {
    describe('when editor is blur', () => {
      it('it is false', () => {
        const { plugin, editorView, pluginState } = editor(
          doc(
            p('paragraph'),
            code_block({ language: 'java' })('code{<>}Block'),
          ),
        );

        plugin.props.handleDOMEvents!.focus(editorView, event);
        plugin.props.handleDOMEvents!.blur(editorView, event);

        expect(pluginState.toolbarVisible).toBe(false);
        editorView.destroy();
      });
    });
  });

  describe('editorFocued', () => {
    describe('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, editorView, pluginState } = editor(
          doc(
            p('paragraph'),
            code_block({ language: 'java' })('code{<>}Block'),
          ),
        );

        plugin.props.handleDOMEvents!.blur(editorView, event);
        plugin.props.handleDOMEvents!.focus(editorView, event);

        expect(pluginState.editorFocused).toBe(true);
        editorView.destroy();
      });
    });

    describe('when editor is blur', () => {
      it('it is false', () => {
        const { plugin, editorView, pluginState } = editor(
          doc(
            p('paragraph'),
            code_block({ language: 'java' })('code{<>}Block'),
          ),
        );

        plugin.props.handleDOMEvents!.blur(editorView, event);

        expect(pluginState.editorFocused).not.toBe(true);
        editorView.destroy();
      });
    });
  });
});
