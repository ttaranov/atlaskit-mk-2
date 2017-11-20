import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import { emoji as emojiNode } from '@atlaskit/editor-common';
import emojiPlugins, { EmojiState } from '../../../src/plugins/emojis';
import {
  makeEditor,
  sendKeyToPm,
  blockquote,
  br,
  doc,
  emoji,
  emojiQuery,
  li,
  p,
  ul,
  code,
  defaultSchema,
  createEvent,
  spyOnReturnValue,
} from '@atlaskit/editor-test-helpers';
import ProviderFactory from '../../../src/providerFactory';

const emojiProvider = emojiTestData.getEmojiResourcePromise();

const grinEmoji = emojiTestData.grinEmoji;
const grinEmojiId = {
  shortName: grinEmoji.shortName,
  id: grinEmoji.id,
  fallback: grinEmoji.fallback,
};

const evilburnsEmoji = emojiTestData.evilburnsEmoji;
const evilburnsEmojiId = {
  shortName: evilburnsEmoji.shortName,
  id: evilburnsEmoji.id,
  fallback: evilburnsEmoji.fallback,
};

describe('emojis', () => {
  const event = createEvent('event');
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) =>
    makeEditor<EmojiState>({
      doc,
      plugins: emojiPlugins(defaultSchema, providerFactory),
    });

  providerFactory.setProvider('emojiProvider', emojiProvider);

  const forceUpdate = (editorView: any) => {
    editorView.updateState(editorView.state);
  };

  describe('keymap', () => {
    describe('ArrowUp', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'onSelectPrevious');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = jest.spyOn(pluginState, 'onSelectPrevious');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "onSelectPrevious" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectPrevious');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });
    });

    describe('ArrowDown', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'onSelectNext');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = jest.spyOn(pluginState, 'onSelectNext');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "onSelectNext" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectNext');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });
    });

    describe('Enter', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'onSelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Enter');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = jest.spyOn(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Enter');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "onSelectCurrent" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Enter');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });
    });

    describe('Shift-Enter', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'onSelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = jest.spyOn(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "onSelectCurrent" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });
    });

    describe('Space', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'trySelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Space');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = jest.spyOn(pluginState, 'trySelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "trySelectCurrent" which should return false', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'trySelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });

      it.only('should call "insertEmoji" if there is only 1 result', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'insertEmoji');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.
        pluginState.onSearchResult({ emojis: [grinEmoji] });

        sendKeyToPm(editorView, 'Space');
        expect(spy).toHaveBeenCalledWith(grinEmoji);
        editorView.destroy();
      });

      it('should call "dismiss" if the query is empty', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':{<>}'))));
        const spy = jest.spyOn(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy).toBeCalled();
        editorView.destroy();
      });
    });

    describe('Escape', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'dismiss');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Esc');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = jest.spyOn(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Esc');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "dismiss" which should return true by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Esc');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(true);
        editorView.destroy();
      });
    });
  });

  describe('insertEmoji', () => {
    it('should replace emoji-query-mark with emoji-node', () => {
      const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin'))));

      pluginState.insertEmoji({
        fallback: 'Oscar Wallhult',
        shortName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc.nodeAt(1)!.type.spec).toEqual(emojiNode);
      editorView.destroy();
    });

    it('should insert a space after the emoji-node', () => {
      const { editorView, pluginState } = editor(doc(p(emojiQuery(':gr{<>}'))));

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqual(doc(p(emoji(grinEmojiId), ' ')));
      editorView.destroy();
    });

    it('should allow inserting multiple emojis next to each other', () => {
      const { editorView, pluginState } = editor(
        doc(p(emoji(grinEmojiId), ' ', emojiQuery(':ev{<>}'))),
      );

      pluginState.insertEmoji(evilburnsEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId), ' ', emoji(evilburnsEmojiId), ' ')),
      );
      editorView.destroy();
    });

    it('should allow inserting emoji on new line after hard break', () => {
      const { editorView, pluginState } = editor(
        doc(p(br, emojiQuery(':gr{<>}'))),
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(br, emoji(grinEmojiId), ' ')),
      );
      editorView.destroy();
    });

    it('should not break list into two when inserting emoji inside list item', () => {
      const { editorView, pluginState } = editor(
        doc(
          p(
            ul(
              li(p('One')),
              li(p('Two ', emojiQuery(':{<>}'))),
              li(p('Three')),
            ),
          ),
        ),
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            ul(
              li(p('One')),
              li(p('Two ', emoji(grinEmojiId), ' ')),
              li(p('Three')),
            ),
          ),
        ),
      );
      editorView.destroy();
    });

    it('should insert only 1 emoji at a time inside blockqoute', () => {
      const { editorView, pluginState } = editor(
        doc(blockquote(p('Hello ', emojiQuery(':{<>}')))),
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello ', emoji(grinEmojiId), ' '))),
      );

      expect(editorView.state.doc.nodeAt(8)!.type.spec).toEqual(emojiNode);
      expect(editorView.state.doc.nodeAt(10)).toBe(null);
      editorView.destroy();
    });
  });

  describe('isEnabled', () => {
    it('returns true when the emoji mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.isEnabled()).toBe(true);
    });

    it('returns false when the emoji mark cannot be applied', () => {
      const { pluginState } = editor(doc(p(code('te{<>}xt'))));
      expect(pluginState.isEnabled()).toBe(false);
    });
  });

  describe('focused', () => {
    context('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.onFocus!(editorView, event);
        expect(pluginState.focused).toEqual(true);
        editorView.destroy();
      });
    });

    context('when editor is not focused', () => {
      it('it is false', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.onBlur!(editorView, event);
        expect(pluginState.focused).toEqual(false);
        editorView.destroy();
      });
    });
  });
});
