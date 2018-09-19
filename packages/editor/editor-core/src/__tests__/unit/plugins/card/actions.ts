import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';

import {
  doc,
  createEditor,
  p,
  CardMockProvider,
} from '@atlaskit/editor-test-helpers';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('actions', () => {
    describe('setProvider', () => {
      it('sets the card provider', () => {
        const { editorView } = editor(doc(p()));
        const { state, dispatch } = editorView;

        const provider = new CardMockProvider();
        dispatch(setProvider(provider)(state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: provider,
        });
      });
    });

    describe('queueCard', () => {
      it('queues a url', () => {
        const { editorView } = editor(doc(p()));
        const {
          dispatch,
          state: { tr },
        } = editorView;
        dispatch(
          queueCards([
            { url: 'http://www.atlassian.com/', pos: 24, appearance: 'inline' },
          ])(tr),
        );
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 24,
              appearance: 'inline',
            },
          ],
          provider: null,
        });
      });

      it('can queue the same url with different positions', () => {
        const { editorView } = editor(doc(p()));
        const { dispatch } = editorView;

        dispatch(
          queueCards([
            { url: 'http://www.atlassian.com/', pos: 24, appearance: 'inline' },
            { url: 'http://www.atlassian.com/', pos: 420, appearance: 'block' },
          ])(editorView.state.tr),
        );

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 24,
              appearance: 'inline',
            },
            {
              url: 'http://www.atlassian.com/',
              pos: 420,
              appearance: 'block',
            },
          ],
          provider: null,
        });
      });
    });

    describe('resolve', () => {
      it('eventually resolves the url from the queue', async () => {
        const { editorView } = editor(doc(p()));
        queueCards([
          { url: 'http://www.atlassian.com/', pos: 1, appearance: 'inline' },
        ])(editorView.state.tr);

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: null,
        });
      });
    });
  });
});
