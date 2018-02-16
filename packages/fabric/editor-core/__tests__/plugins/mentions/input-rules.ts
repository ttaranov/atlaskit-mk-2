import { testData as emojiTestData } from '@atlaskit/emoji';
import {
  MentionsState,
  stateKey as mentionPluginKey,
} from '../../../src/plugins/mentions';
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
import { storyData as mentionStoryData } from '@atlaskit/mention';
import mentionsPlugin from '../../../src/editor/plugins/mentions';
import emojiPlugin from '../../../src/editor/plugins/emoji';
import codeBlockPlugin from '../../../src/editor/plugins/code-block';
import textFormatting from '../../../src/editor/plugins/text-formatting';

const emojiProvider = emojiTestData.getEmojiResourcePromise();

describe('mentions - input rules', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor<MentionsState>({
      doc,
      editorPlugins: [
        mentionsPlugin,
        emojiPlugin,
        codeBlockPlugin,
        textFormatting(),
      ],
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

  const assert = (what: string, expected: boolean, docContents?: any) => {
    const { editorView, pluginState, sel, refs } = editor(
      doc(docContents || p('{<>}')),
    );

    return pluginState
      .setMentionProvider(Promise.resolve(mentionStoryData.resourceProvider))
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
});
