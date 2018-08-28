import {
  emoji as emojiData,
  mention as mentionData,
} from '@atlaskit/util-data-test';
import {
  MentionsState,
  mentionPluginKey,
} from '../../../../plugins/mentions/pm-plugins/main';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  insertText,
  createEditor,
  doc,
  p,
  code_block,
  hardBreak,
  emoji,
  mention,
  code,
} from '@atlaskit/editor-test-helpers';
import mentionsPlugin from '../../../../plugins/mentions';
import emojiPlugin from '../../../../plugins/emoji';
import codeBlockPlugin from '../../../../plugins/code-block';
import { EditorView } from 'prosemirror-view';
import { setTextSelection } from '../../../../index';

const emojiProvider = emojiData.testData.getEmojiResourcePromise();

describe('mentions - input rules', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor<MentionsState>({
      doc,
      editorPlugins: [mentionsPlugin, emojiPlugin, codeBlockPlugin()],
      editorProps: {
        analyticsHandler: trackEvent,
      },
      providerFactory: ProviderFactory.create({
        emojiProvider: Promise.resolve(emojiProvider),
      }),
      pluginKey: mentionPluginKey,
    });

  beforeEach(() => {
    trackEvent = jest.fn();
  });

  const assert = (
    what: string,
    expected: boolean,
    docContents?: any,
    after?: ((view: EditorView, pluginState: MentionsState) => void),
  ) => {
    const { editorView, pluginState, sel, refs } = editor(
      doc(docContents || p('{<>}')),
    );

    return pluginState
      .setMentionProvider(
        Promise.resolve(mentionData.storyData.resourceProvider),
      )
      .then(() => {
        insertText(editorView, what, sel || refs['<']);

        const { state } = editorView;
        const { mentionQuery } = state.schema.marks;
        const cursorFocus = state.selection.$to.nodeBefore!;
        expect(!!mentionQuery.isInSet(cursorFocus.marks)).toEqual(expected);
        if (expected) {
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.fabric.mention.picker.trigger.shortcut',
          );
        } else {
          expect(trackEvent).not.toHaveBeenCalledWith(
            'atlassian.fabric.mention.picker.trigger.shortcut',
          );
        }

        if (after) {
          after(editorView, pluginState);
        }
      });
  };

  it('should replace a standalone "@" with mention-query-mark', () => {
    return assert('foo @', true);
  });

  it('should not replace a "@" when part of a word', () => {
    return assert('foo@', false);
  });

  it('should not replace a "@" after the "`"', () => {
    return assert('`@', false);
  });

  it('should replace "@" at the start of the content', () => {
    return assert('@', true);
  });

  it('should replace "@" if there are multiple spaces in front of it', () => {
    return assert('  @', true);
  });

  it('should replace "@" if there is a hardbreak node in front of it', () => {
    return assert('@', true, p(hardBreak(), '{<>}'));
  });

  it('should replace "@" if there is another emoji node in front of it', () => {
    return assert('@', true, p(emoji({ shortName: ':smiley:' })(), '{<>}'));
  });

  it('should replace "@" if there is a mention node in front of it', () => {
    return assert(
      '@',
      true,
      p(mention({ id: '1234', text: '@SpongeBob' })(), '{<>}'),
    );
  });

  it('should not replace "@" when in an unsupported node', () => {
    return assert('@', false, code_block()('{<>}'));
  });

  it('should not replace "@" when there is an unsupported stored mark', () => {
    return assert('@', false, p(code('var {<>}')));
  });

  it('should replace non empty selection with mentionQuery mark', () => {
    return assert('@', true, p('{<}text{>}'));
  });

  it('should not replace non empty selection with mentionQuery mark if selection starts with an excluding mark', () => {
    return assert('@', false, p(code('{<}text{>}')));
  });

  it('should replace "@" when preceded by an open round bracket', () => {
    return assert('(@', true);
  });

  it('should keep an active mention query if the query text is replaced', () => {
    return assert('@hey', true, null, (view, pluginState) => {
      // select the whole document, bar the @
      setTextSelection(view, 2, view.state.doc.nodeSize - 2);
      expect(pluginState.queryActive).toBe(true);

      'nice'.split('').forEach(char => {
        view.dispatch(
          view.state.tr.insertText(
            char,
            view.state.selection.from,
            view.state.selection.to,
          ),
        );
      });

      expect(pluginState.queryActive).toBe(true);
      expect(pluginState.query).toEqual('nice');
    });
  });

  it('should still show mention query if the original mention is replaced with another', () => {
    return assert('@hey', true, null, (view, pluginState) => {
      // select the whole document
      setTextSelection(view, 1, view.state.doc.nodeSize - 2);
      expect(pluginState.queryActive).toBe(true);

      '@nice'.split('').forEach(char => {
        view.dispatch(
          view.state.tr.insertText(
            char,
            view.state.selection.from,
            view.state.selection.to,
          ),
        );
      });

      expect(pluginState.queryActive).toBe(true);
      expect(pluginState.query).toEqual('nice');
    });
  });

  it('should remove the mention query if the entire mention is replaced', () => {
    return assert('@hey', true, null, (view, pluginState) => {
      // select the whole document
      setTextSelection(view, 1, view.state.doc.nodeSize - 2);
      expect(pluginState.queryActive).toBe(true);

      'text'.split('').forEach(char => {
        view.dispatch(
          view.state.tr.insertText(
            char,
            view.state.selection.from,
            view.state.selection.to,
          ),
        );
      });

      expect(pluginState.queryActive).toBe(false);
    });
  });
});
