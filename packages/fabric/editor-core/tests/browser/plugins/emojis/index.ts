import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import { emoji as emojiNode } from '@atlaskit/editor-common';
import emojiPlugins, { EmojiState } from '../../../../src/plugins/emojis';
import {
  chaiPlugin,
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
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import ProviderFactory from '../../../../src/providerFactory';

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

chai.use(chaiPlugin);

describe('emojis', () => {
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) => makeEditor<EmojiState>({
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
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectPrevious');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = sinon.spy(pluginState, 'onSelectPrevious');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "onSelectPrevious" which should return false by default', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectPrevious');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(false), 'return value').to.equal(true);
        editorView.destroy();
      });
    });

    describe('ArrowDown', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectNext');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = sinon.spy(pluginState, 'onSelectNext');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "onSelectNext" which should return false by default', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectNext');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(false), 'return vale').to.equal(true);
        editorView.destroy();
      });
    });

    describe('Enter', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Enter');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Enter');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "onSelectCurrent" which should return false by default', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Enter');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(false), 'return value').to.equal(true);
        editorView.destroy();
      });
    });

    describe('Shift-Enter', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "onSelectCurrent" which should return false by default', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'onSelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(false), 'return value').to.equal(true);
        editorView.destroy();
      });
    });

    describe('Space', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'trySelectCurrent');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Space');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sinon.spy(pluginState, 'trySelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "trySelectCurrent" which should return false', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'trySelectCurrent');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(false), 'return value').to.equal(true);
        editorView.destroy();
      });

      it('should call "insertEmoji" if there is only 1 result', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'insertEmoji');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.
        pluginState.onSearchResult({emojis: [grinEmoji]});

        sendKeyToPm(editorView, 'Space');
        expect(spy.calledWith(grinEmoji), 'was called').to.equal(true);
        editorView.destroy();
      });

      it('should call "dismiss" if the query is empty', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':{<>}'))));
        const spy = sinon.spy(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Space');
        expect(spy.called, 'was called').to.equal(true);
        editorView.destroy();
      });
    });

    describe('Escape', () => {
      it('should be ignored if there is no emojiProvider', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'dismiss');

        forceUpdate(editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Esc');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello{<>}')));
        const spy = sinon.spy(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Esc');
        expect(spy.called, 'was not called').to.equal(false);
        editorView.destroy();
      });

      it('should call "dismiss" which should return true by default', () => {
        const { editorView, pluginState } = editor(doc(p(emojiQuery(':grin{<>}'))));
        const spy = sinon.spy(pluginState, 'dismiss');
        (pluginState as any).emojiProvider = true;
        forceUpdate(editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Esc');
        expect(spy.called, 'was called').to.equal(true);
        expect(spy.returned(true), 'return value').to.equal(true);
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
        id: '1234'
      });

      expect(editorView.state.doc.nodeAt(1), 'emoji node').to.be.of.nodeSpec(emojiNode);
      editorView.destroy();
    });

    it('should insert a space after the emoji-node', () => {
      const { editorView, pluginState } = editor(doc(p(emojiQuery(':gr{<>}'))));

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc, 'document').to.deep.equal(
        doc(
          p(
            emoji(grinEmojiId),
            ' '
          )
        )
      );
      editorView.destroy();
    });

    it('should allow inserting multiple emojis next to each other', () => {
      const { editorView, pluginState } = editor(
        doc(
          p(
            emoji(grinEmojiId),
            ' ',
            emojiQuery(':ev{<>}')
          )
        )
      );

      pluginState.insertEmoji(evilburnsEmojiId);

      expect(editorView.state.doc, 'document').to.deep.equal(
        doc(
          p(
            emoji(grinEmojiId),
            ' ',
            emoji(evilburnsEmojiId),
            ' '
          )
        )
      );
      editorView.destroy();
    });

    it('should allow inserting emoji on new line after hard break', () => {
      const { editorView, pluginState } = editor(doc(p(br, emojiQuery(':gr{<>}'))));

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc, 'document').to.deep.equal(
        doc(
          p(
            br,
            emoji(grinEmojiId),
            ' '
          )
        )
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
              li(p('Three'))))));

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc, 'document').to.deep.equal(
        doc(
          p(
            ul(
              li(p('One')),
              li(
                p(
                  'Two ',
                  emoji(grinEmojiId),
                  ' '
                )
              ),
              li(p('Three'))
            )
          )
        )
      );
      editorView.destroy();
    });

    it('should insert only 1 emoji at a time inside blockqoute', () => {
      const { editorView, pluginState } = editor(
        doc(
          blockquote(
            p('Hello ', emojiQuery(':{<>}'))
          )
        )
      );

      pluginState.insertEmoji(grinEmojiId);

      expect(editorView.state.doc, 'document').to.deep.equal(
        doc(
          blockquote(
            p(
              'Hello ',
              emoji(grinEmojiId),
              ' '
            )
          )
        )
      );

      expect(editorView.state.doc.nodeAt(8), 'emoji node').to.be.of.nodeSpec(emojiNode);
      expect(editorView.state.doc.nodeAt(10), 'no node').to.equal(null);
      editorView.destroy();
    });
  });

  describe('isEnabled', () => {
    it('returns true when the emoji mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.isEnabled()).to.equal(true);
    });

    it('returns false when the emoji mark cannot be applied', () => {
      const { pluginState } = editor(doc(p(code('te{<>}xt'))));
      expect(pluginState.isEnabled()).to.equal(false);
    });
  });
});
