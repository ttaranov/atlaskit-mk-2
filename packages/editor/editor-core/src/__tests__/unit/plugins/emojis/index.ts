import { Node as PMNode } from 'prosemirror-model';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import { emoji as emojiNode, ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditor,
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
  createEvent,
  spyOnReturnValue,
} from '@atlaskit/editor-test-helpers';
import { emojiPluginKey } from '../../../../plugins/emoji/pm-plugins/main';
import emojiPlugin from '../../../../plugins/emoji';
import listPlugin from '../../../../plugins/lists';

const { testData } = emojiData;

const emojiProvider = testData.getEmojiResourcePromise();

const grinEmoji = testData.grinEmoji;
const grinEmojiId = {
  shortName: grinEmoji.shortName,
  id: grinEmoji.id,
  fallback: grinEmoji.fallback,
};

const evilburnsEmoji = testData.evilburnsEmoji;
const evilburnsEmojiId = {
  shortName: evilburnsEmoji.shortName,
  id: evilburnsEmoji.id,
  fallback: evilburnsEmoji.fallback,
};

describe('emojis', () => {
  const event = createEvent('event');
  const providerFactory = ProviderFactory.create({ emojiProvider });
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [emojiPlugin, listPlugin],
      providerFactory,
      pluginKey: emojiPluginKey,
    });

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
        pluginState.onSearchResult({ emojis: [grinEmoji] });

        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Enter');
        expect(spy).toHaveBeenCalledWith('Enter');
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
        pluginState.onSearchResult({ emojis: [grinEmoji] });

        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).toHaveBeenCalledWith('Shift-Enter');
        expect(spy.returnValue).toBe(false);
        editorView.destroy();
      });
    });

    describe('Space', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'trySelectCurrentWithSpace');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Space');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = jest.spyOn(pluginState, 'trySelectCurrentWithSpace');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy).not.toBeCalled();
        editorView.destroy();
      });

      it('should call "trySelectCurrentWithSpace" which should return false', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'trySelectCurrentWithSpace');
        const spyOnSpaceTyped = jest.spyOn(pluginState, 'onSpaceTyped');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy).toBeCalled();
        expect(spy.returnValue).toBe(false);
        expect(spyOnSpaceTyped).toBeCalled();
        editorView.destroy();
      });

      it('should call "insertEmoji" if there is only 1 result', () => {
        const { editorView, pluginState } = editor(
          doc(p(emojiQuery(':grin{<>}'))),
        );
        const spy = jest.spyOn(pluginState, 'insertEmoji');
        const spyOnSpaceSelectCurrent = jest.spyOn(
          pluginState,
          'onSpaceSelectCurrent',
        );
        const spyOnSpaceTyped = jest.spyOn(pluginState, 'onSpaceTyped');

        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.
        pluginState.onSearchResult({ emojis: [grinEmoji] });

        sendKeyToPm(editorView, 'Space');
        expect(spy).toHaveBeenCalledWith(grinEmoji);

        expect(spyOnSpaceSelectCurrent).toHaveBeenCalledWith(
          grinEmoji,
          'Space',
          ':grin',
        );
        expect(spyOnSpaceTyped).not.toBeCalled();
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
        const spyOnDismiss = spyOnReturnValue(pluginState, 'onDismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Esc');
        expect(spy).toBeCalled();

        // onDismiss handler should be called
        expect(spyOnDismiss).toBeCalled();
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

      expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
        emojiNode,
      );
      editorView.destroy();
    });

    it('should insert a space after the emoji-node', () => {
      const { editorView, pluginState } = editor(doc(p(emojiQuery(':gr{<>}'))));

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ')),
      );
      editorView.destroy();
    });

    it('should allow inserting multiple emojis next to each other', () => {
      const { editorView, pluginState } = editor(
        doc(p(emoji(grinEmojiId)(), ' ', emojiQuery(':ev{<>}'))),
      );

      pluginState.insertEmoji(evilburnsEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ', emoji(evilburnsEmojiId)(), ' ')),
      );
      editorView.destroy();
    });

    it('should allow inserting emoji on new line after hard break', () => {
      const { editorView, pluginState } = editor(
        doc(p(br(), emojiQuery(':gr{<>}'))),
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(br(), emoji(grinEmojiId)(), ' ')),
      );
      editorView.destroy();
    });

    it('should not break list into two when inserting emoji inside list item', () => {
      const { editorView, pluginState } = editor(
        doc(
          ul(li(p('One')), li(p('Two ', emojiQuery(':{<>}'))), li(p('Three'))),
        ),
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('One')),
            li(p('Two ', emoji(grinEmojiId)(), ' ')),
            li(p('Three')),
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
        doc(blockquote(p('Hello ', emoji(grinEmojiId)(), ' '))),
      );

      expect((editorView.state.doc.nodeAt(8) as PMNode).type.spec).toEqual(
        emojiNode,
      );
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
    describe('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(pluginState.focused).toEqual(true);
        editorView.destroy();
      });
    });

    describe('when editor is not focused', () => {
      it('it is false', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.focused).toEqual(false);
        editorView.destroy();
      });
    });
  });
});
